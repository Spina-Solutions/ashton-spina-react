#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

// Read the stack name suffix
const stackNameSuffixPath = join(__dirname, '../cdk/stack-name-suffix.json');
const { stackNameSuffix } = JSON.parse(readFileSync(stackNameSuffixPath, 'utf-8'));
const stackName = `VikeStack-${stackNameSuffix}`;

console.log(`🔍 Getting bucket name from stack: ${stackName}`);

// Get the bucket name from CloudFormation outputs
let bucketName;
try {
  const output = execSync(
    `aws cloudformation describe-stacks --stack-name ${stackName} --query "Stacks[0].Outputs[?OutputKey=='AssetsBucketName'].OutputValue" --output text`,
    { encoding: 'utf-8' }
  ).trim();
  
  bucketName = output;
  
  if (!bucketName) {
    throw new Error('Bucket name not found in stack outputs');
  }
  
  console.log(`✅ Found bucket: ${bucketName}`);
} catch (error) {
  console.error('❌ Failed to get bucket name:', error.message);
  process.exit(1);
}

// Sync the public/photography directory to S3
const publicDir = join(__dirname, '../public');
console.log(`📤 Syncing photography files to s3://${bucketName}/photography/`);

try {
  execSync(
    `aws s3 sync "${publicDir}/photography" "s3://${bucketName}/photography/" --cache-control "max-age=2592000,s-maxage=2592000" --delete`,
    { stdio: 'inherit' }
  );
  console.log('✅ Photography files synced successfully!');
} catch (error) {
  console.error('❌ Failed to sync photography files:', error.message);
  process.exit(1);
}

