Generated with [vike.dev/new](https://vike.dev/new) ([version 462](https://www.npmjs.com/package/create-vike/v/0.0.462)) using this command:

```sh
npm create vike@latest --- --react --tailwindcss --ts-rest --hono --google-analytics --aws --prettier --sentry
```

## Contents

* [React](#react)

  * [`/pages/+config.ts`](#pagesconfigts)
  * [Routing](#routing)
  * [`/pages/_error/+Page.jsx`](#pages_errorpagejsx)
  * [`/pages/+onPageTransitionStart.ts` and `/pages/+onPageTransitionEnd.ts`](#pagesonpagetransitionstartts-and-pagesonpagetransitionendts)
  * [SSR](#ssr)
  * [HTML Streaming](#html-streaming)

* [Sentry Browser / Error Tracking & Performance Monitoring](#sentry-browser--error-tracking--performance-monitoring)

* [*AWS CDK Deployment*](#aws-cdk-deployment)

  * [Prerequisites](#prerequisites)

  * [Deployment to AWS](#deployment-to-aws)

  * [Stack Configuration](#stack-configuration)

    * [Custom Domain](#custom-domain)

  * [Destroying the Stack on AWS](#destroying-the-stack-on-aws)

## React

This app is ready to start. It's powered by [Vike](https://vike.dev) and [React](https://react.dev/learn).

### `/pages/+config.ts`

Such `+` files are [the interface](https://vike.dev/config) between Vike and your code. It defines:

* A default [`<Layout>` component](https://vike.dev/Layout) (that wraps your [`<Page>` components](https://vike.dev/Page)).
* A default [`title`](https://vike.dev/title).
* Global [`<head>` tags](https://vike.dev/head-tags).

### Routing

[Vike's built-in router](https://vike.dev/routing) lets you choose between:

* [Filesystem Routing](https://vike.dev/filesystem-routing) (the URL of a page is determined based on where its `+Page.jsx` file is located on the filesystem)
* [Route Strings](https://vike.dev/route-string)
* [Route Functions](https://vike.dev/route-function)

### `/pages/_error/+Page.jsx`

The [error page](https://vike.dev/error-page) which is rendered when errors occur.

### `/pages/+onPageTransitionStart.ts` and `/pages/+onPageTransitionEnd.ts`

The [`onPageTransitionStart()` hook](https://vike.dev/onPageTransitionStart), together with [`onPageTransitionEnd()`](https://vike.dev/onPageTransitionEnd), enables you to implement page transition animations.

### SSR

SSR is enabled by default. You can [disable it](https://vike.dev/ssr) for all your pages or only for some pages.

### HTML Streaming

You can enable/disable [HTML streaming](https://vike.dev/stream) for all your pages, or only for some pages while still using it for others.

## Sentry Browser / Error Tracking & Performance Monitoring

This app is integrated with [Sentry](https://sentry.io) for error tracking.

Add your Sentry DSN to `.env` file.
You can configure [Sentry for the browser](https://docs.sentry.io/platforms/javascript/guides/react/) in `sentry.browser.config.ts`.

Upload of source maps to Sentry is handled by the [`sentryVitePlugin`](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/) in `vite.config.ts`.
You have to configure `SENTRY_ORG`, `SENTRY_PROJECT` and `SENTRY_AUTH_TOKEN` in the `.env.sentry-build-plugin` file with the values from your Sentry account.

> \[!NOTE]
> Sentry Error Tracking is **only activated in production** (`import.meta.env.PROD === true`)!

**Testing Sentry** receiving Errors:

1. Build & Start the app `pnpm build && pnpm preview`.
2. open Testpage in browser: http://localhost:3000/sentry.
3. check your [Sentry Dashboard](https://sentry.io) for new Errors.

## *AWS CDK Deployment*

This is a boilerplate for deploying your Vike app to AWS using the AWS Cloud Development Kit (CDK) including creating a custom domain in Route53.

**Architecture:**

* S3 Bucket for static client assets (`/dist/client/assets`).
* Lambda function for the backend and SSR.
* CloudFront distribution for CDN and routing requests `/assets/*` to the S3 bucket.

This boilerplate is a starting point for deploying your Vike app to AWS. You can customize the deployment by modifying the `cdk/lib/vike-stack.ts` file.

### Prerequisites

Before you get started, make sure to configure your AWS credentials.

**Loading from a file:**

You can keep your AWS credentials in a file. The credentials are found at:

`~/.aws/credentials` on Linux, Unix, and macOS;
`C:\Users\USER_NAME\.aws\credentials` on Windows

If the credentials file does not exist on your machine:

Download the AWS CLI from [here](https://aws.amazon.com/cli/) and configure your AWS credentials using the following command:
`aws configure`

And then use this guide to configure the credentials
The credentials file should look like:

`[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>`

**Loading from environment variables:**

AWS SDK automatically detects AWS credentials in your environment and uses them for making requests to AWS. The environment variables that you need to set are:

`AWS_ACCESS_KEY_ID`
`AWS_SECRET_ACCESS_KEY`
If you are using temporary credentials, also set:

`AWS_SESSION_TOKEN`
This is often the most convenient way to configure credentials when deploying your AWS CDK app in a CI environment.

> \[!NOTE]
> You should change the stack name to give your app stack a distinctive name in your AWS environment. You can do so by modifying the `infrastructure.ts.ts` file in the `cdk/bin` directory.

### Deployment to AWS

If you want to have a look at the synthesized CloudFormation template, you can run `pnpm cdk synth` and see the template as YAML on screen or in `cdk.out/VikeStack.template.json`.

> \[!NOTE]
> If this is your **first time deploying a CDK app** in this environment you need to **bootstrap**:
> `pnpm cdk bootstrap`. (The default region based on your AWS CLI configuration will be used)

You can deploy your Vike App via the following command:
`pnpm deploy:aws` or `pnpm cdk deploy`

The URL to the CloudFront distribution will be displayed in the output of the deployment.
You can also access the CloudFront distribution domainname in the AWS SSM registry und `vike/distribution/url`.

### Stack Configuration

You can configure the stack in the `cdk/bin/infrastructure.ts` file:

| Variable | Examples | Description |
| --- | --- | --- |
| `domainName: "example.com",` | "example.com" |  |
| `subDomain: "www",` |"www" | |
| `certificate: undefined,` | "arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012" or a certificatemanager.ICertificate | reuse an existing AWS Certificate |
| `hostedZone: undefined,` | route53.HostedZone.fromLookup(stack, "MyHostedZone", { domainName: "example.com" }) | |

If `domainName` is managed by **Route53**, the `hostedZone` will be updated with by lookup in Route53 based on the `domainName`.

These scenarios are supported:
A. `domainName` exists in Route53, `subDomain` is given - the subdomain with the domain are used as alternative domains for the CloudFront Distribution. An new Certificate for the url is created and assigned to the CF-Distribution. An Alias-Record pointing to the CF-Distribution ist created in Route53.
B. `domainName` exists in Route53, `subDomain` is given - the subdomain with the domain are used as alternative domains for the CloudFront Distribution. If `certificate` contains a valid entry it will be assigned to the CF-Distribution. An Alias-Record pointing to the CF-Distribution ist created in Route53.
C. `domainName` **does not exist** in Route53, `subDomain` is given - the subdomain with the domain are used as alternative domains for the CloudFront Distribution. If `certificate` contains a valid entry it will be assigned to the CF-Distribution. A manual created CNAME or A-Record should pointing to the CF-Distribution.

#### Custom Domain

If you have a custom domain, you can add it to the stack configuration in the `cdk/bin/infrastructure.ts` file:

> \[!NOTE]
> If you deploy your App to a region different than `us-east-1` and you have never deployed to this region before, you will need to bootstrap this region too:
> `CDK_DEFAULT_REGION=us-east-1 pnpm deploy:cdk bootstrap`

### Destroying the Stack on AWS

To destroy the stack on AWS, run the following command:
`pnpm cdk destroy`

Or delete the CloudFormation stack which starts with "VikeStack-<Your App Name>" created by this project.

