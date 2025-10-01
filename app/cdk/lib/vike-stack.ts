#!/usr/bin/env node
import "source-map-support/register";
import { Construct } from "constructs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import * as cdk from "aws-cdk-lib";
import * as ssm from "aws-cdk-lib/aws-ssm";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as origin from "aws-cdk-lib/aws-cloudfront-origins";
import * as api from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import { existsSync } from "node:fs";
import type { CustomStackProps } from "../bin/infrastructure";

type VikeStackProps = cdk.StackProps & {
  customStackProps: CustomStackProps;
};

// Define __dirname for ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

export class VikeStack extends cdk.Stack {
  readonly distributionUrlParameterName = `/${this.stackName}/distribution/url`;

  constructor(scope: Construct, id: string, props: VikeStackProps) {
    super(scope, id, props);

    const certificate =
      props.customStackProps?.certificate && typeof props.customStackProps?.certificate !== "string"
        ? props.customStackProps?.certificate
        : undefined;

    const hostedZone = props.customStackProps?.hostedZone;
    const subDomain = props.customStackProps?.subDomain;
    const domainName = props.customStackProps?.domainName;
    const siteDomainName = domainName
      ? `${(subDomain?.length ?? 0 > 0) ? `${subDomain}.` : ""}${domainName}`
      : undefined;

    // Support both apex and www for the distribution
    const alternateDomainNames = siteDomainName
      ? Array.from(new Set([siteDomainName, domainName!].filter(Boolean)))
      : undefined;

    const bucket = new s3.Bucket(this, "StaticAssetsBucket", {
      /**
       * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
       */
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code

      /**
       * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
       * setting will enable full cleanup of the demo.
       */
      autoDeleteObjects: true, // NOT recommended for production code
      // Allow ACLs to be used by deployment if account-level ownership isn't enforced
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
    });

    // Create a Lambda function for the backend
    const banner =
      "const require = (await import('node:module')).createRequire(import.meta.url);const __filename = (await import('node:url')).fileURLToPath(import.meta.url);const __dirname = (await import('node:path')).dirname(__filename);";

    const fn = new nodejs.NodejsFunction(this, "RequestHandler", {
      handler: "handler",
      entry: join(__dirname, "../../entry_aws_lambda.ts"),
      // fix error: "Cannot find a package lock file ..." when using "bun" javascript package manager and runtime
      depsLockFilePath: findBunLockFile(),
      environment: {
        NODE_ENV: "production",
      },
      bundling: {
        banner,
        format: nodejs.OutputFormat.ESM,
        minify: true,
        target: "esnext",
        //nodeModules: ["react", "react-dom"],
        esbuildArgs: {
          "--tree-shaking": true,
        },
      },
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      logRetention: logs.RetentionDays.THREE_DAYS,
      tracing: lambda.Tracing.ACTIVE,
    });

    const integration = new HttpLambdaIntegration("RequestHandlerIntegration", fn, {
      payloadFormatVersion: api.PayloadFormatVersion.VERSION_2_0,
    });

    const httpApi = new api.HttpApi(this, "WebsiteApi", {
      defaultIntegration: integration,
    });

    const httpApiUrl = `${httpApi.httpApiId}.execute-api.${cdk.Stack.of(this).region}.${cdk.Stack.of(this).urlSuffix}`;

    // Create a CloudFront distribution with custom behaviors
    const requestHandlerOrigin = new origin.HttpOrigin(httpApiUrl);

    const requestHandlerBehavior: cloudfront.AddBehaviorOptions = {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
      // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-origin-request-policies.html
      originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      compress: true,
    };

    const assetOrigin = origin.S3BucketOrigin.withOriginAccessControl(bucket);
    const assetBehaviorOptions = {
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      compress: true,
    };

    // Redirect apex (ashtonspina.com) to www (www.ashtonspina.com) at the edge
    const redirectFunction = domainName
      ? new cloudfront.Function(this, "RedirectToWwwFunction", {
          code: cloudfront.FunctionCode.fromInline(
            `function handler(event) {
  var request = event.request;
  var host = request.headers && request.headers.host ? request.headers.host.value : '';
  
  // Helper to build querystring from CloudFront querystring object
  function buildQueryString(querystring) {
    if (!querystring) return '';
    var parts = [];
    for (var key in querystring) {
      if (!Object.prototype.hasOwnProperty.call(querystring, key)) continue;
      var entry = querystring[key];
      if (entry && entry.multiValue && entry.multiValue.length > 0) {
        for (var i = 0; i < entry.multiValue.length; i++) {
          parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(entry.multiValue[i].value || ''));
        }
      } else {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent((entry && entry.value) || ''));
      }
    }
    return parts.length > 0 ? '?' + parts.join('&') : '';
  }
  
  // Remove trailing slashes (except root /)
  if (request.uri.length > 1 && request.uri.endsWith('/')) {
    var newUri = request.uri.slice(0, -1);
    var qs = buildQueryString(request.querystring);
    var location = 'https://' + host + newUri + qs;
    return { statusCode: 301, statusDescription: 'Moved Permanently', headers: { location: { value: location } } };
  }
  
  // Legacy URL redirect: /content/ontario-city-problem -> /media/ontario-city-problem
  if (request.uri === '/content/ontario-city-problem') {
    var qs = buildQueryString(request.querystring);
    var location = 'https://www.${domainName}/media/ontario-city-problem' + qs;
    return { statusCode: 301, statusDescription: 'Moved Permanently', headers: { location: { value: location } } };
  }
  
  // Only redirect apex to www; keep other hosts untouched
  if (host === '${domainName}') {
    var qs = buildQueryString(request.querystring);
    var location = 'https://www.${domainName}' + request.uri + qs;
    return { statusCode: 301, statusDescription: 'Moved Permanently', headers: { location: { value: location } } };
  }
  return request;
}`
          ),
        })
      : undefined;

    const distribution = new cloudfront.Distribution(this, "CloudFront", {
      defaultBehavior: {
        origin: requestHandlerOrigin,
        ...requestHandlerBehavior,
        functionAssociations: redirectFunction
          ? [
              {
                function: redirectFunction,
                eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
              },
            ]
          : undefined,
      },
      domainNames: alternateDomainNames,
      certificate,
      enableIpv6: true,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      httpVersion: cloudfront.HttpVersion.HTTP2_AND_3,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
    });

    distribution.addBehavior("/assets/*", assetOrigin, assetBehaviorOptions);
    distribution.addBehavior("/photography/*", assetOrigin, assetBehaviorOptions);
    
    // Add behaviors for SEO files to serve from S3
    distribution.addBehavior("/sitemap.xml", assetOrigin, {
      ...assetBehaviorOptions,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
    });
    distribution.addBehavior("/robots.txt", assetOrigin, {
      ...assetBehaviorOptions,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
    });

    // Deploy static assets to the S3 bucket and invalidate the CloudFront cache
    new s3deploy.BucketDeployment(this, "DeployStaticAssets", {
      // Only deploy the assets folder to reduce bundle size and /tmp usage
      sources: [s3deploy.Source.asset(join(__dirname, "../../dist/client/assets"))],
      destinationBucket: bucket,
      destinationKeyPrefix: "assets",
      distribution,
      distributionPaths: ["/assets/*"],
      // Avoid long deletion scans; also keeps existing photography files intact
      prune: false,
      // Reduce custom resource response size risk
      outputObjectKeys: false,
      // Give the deployment more resources for large batches
      memoryLimit: 1024,
      ephemeralStorageSize: cdk.Size.mebibytes(2048),
      cacheControl: [
        s3deploy.CacheControl.maxAge(cdk.Duration.days(365)),
        s3deploy.CacheControl.sMaxAge(cdk.Duration.days(365)),
      ],
    });
    
    // Deploy SEO files (sitemap.xml, robots.txt) to S3 root
    new s3deploy.BucketDeployment(this, "DeploySEOFiles", {
      sources: [s3deploy.Source.asset(join(__dirname, "../../dist/client"), {
        exclude: ["assets/**", "photography/**", "**/*.js", "**/*.css", "**/*.map"],
      })],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/sitemap.xml", "/robots.txt"],
      prune: false,
      outputObjectKeys: false,
      cacheControl: [
        s3deploy.CacheControl.maxAge(cdk.Duration.days(1)),
        s3deploy.CacheControl.sMaxAge(cdk.Duration.days(1)),
      ],
    });

    // Removed separate deployment for public assets; all static files are deployed via dist/client

    // Create a Route 53 alias record pointing to the CloudFront distribution
    if (hostedZone) {
      // www record
      new route53.ARecord(this, "AliasRecord", {
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
        recordName: subDomain ?? "",
      });
      new route53.AaaaRecord(this, "AliasRecordAAAA", {
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
        recordName: subDomain ?? "",
      });
      // apex record
      new route53.ARecord(this, "AliasRecordApex", {
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
        recordName: "",
      });
      new route53.AaaaRecord(this, "AliasRecordApexAAAA", {
        zone: hostedZone,
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
        recordName: "",
      });
    }

    // Store the CloudFront URL in an SSM parameter
    new ssm.StringParameter(this, "DistributionUrlParameter", {
      parameterName: this.distributionUrlParameterName,
      stringValue: siteDomainName ? siteDomainName! : distribution.distributionDomainName,
      tier: ssm.ParameterTier.STANDARD,
    });

    // Store the assets bucket name in SSM for post-deploy sync scripts
    const bucketNameParameterName = `/${this.stackName}/assets/bucket-name`;
    new ssm.StringParameter(this, "AssetsBucketNameParameter", {
      parameterName: bucketNameParameterName,
      stringValue: bucket.bucketName,
      tier: ssm.ParameterTier.STANDARD,
    });

    // Output the CloudFront URL and API endpoint
    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: `https://${siteDomainName ? siteDomainName : distribution.distributionDomainName}`,
    });

    new cdk.CfnOutput(this, "CloudFrontID", {
      value: distribution.distributionId,
    });

    new cdk.CfnOutput(this, "AssetsBucketName", {
      value: bucket.bucketName,
      exportName: `${this.stackName}-AssetsBucketName`,
    });
  }
}

function findBunLockFile() {
  let bunLockFile = join(__dirname, "../../", "bun.lockb");
  if (existsSync(bunLockFile)) {
    return bunLockFile;
  }
  bunLockFile = join(__dirname, "../../", "../../", "bun.lockb"); // special case for bat tests
  if (existsSync(bunLockFile)) {
    return bunLockFile;
  }
  return undefined;
}
