# README.md: Leveraging S3 through API Gateway and AWS Lambda
## Overview

Welcome to this guide on how to use AWS S3, API Gateway, and Lambda to handle image uploads and transformations. With this architecture, you can upload images through API Gateway, which acts as a proxy to S3. The images will then be processed by Lambda functions to check their size, resize them, and delete if they exceed a certain size.

## Architecture

![Architecture](https://github.com/iwaduarte/tutorial-apigateway-s3-proxy/blob/69e455e04c7e883b8903e21301fb1cb47f0269bf/upload-s3-rest-api-v2.png)

## Why use API Gateway as a proxy?
- **Cold Starts**: Reduced cold starts as opposed to using Lambdas.
- **Cost:** Cost effective.
- **Logs:** Centralized logging.
- **Limits:** Easier to manage rate limits.
- **Simplicity**
- **Low Maintenance**
- **Scalability**


## Quick Start
### Requirements
- Node.js
- Serverless Framework

## Step 1: Setup
Create a folder called `upload-s3` and navigate into it via the terminal.

```bash
mkdir upload-s3
cd upload-s3  
```

## Step 2: Install Dependencies
```bash
npm init -y
npm install -g serverless
npm install -D serverless-apigateway-service-proxy serverless-domain-manager
```
## Step 3: Environment Configuration
Create a `.env` file and add the following:

```env
CUSTOM_DOMAIN=images.yourdomain.com
CERTIFICATE_ARN=arn:aws:acm:region:account-id:certificate/certificate-id
SECRET=DONOTDRINKTHEKOOLAID
```

## Step 4: Serverless Configuration
Create a serverless.yml and populate it as shown in the repo.

## Step 5: JWT Authorizer
Create an `authorizer.mjs` file and add JWT authorization logic as shown in the repo.

Install the jwt dependency:

```bash
npm install jsonwebtoken
```
## Step 6: File Handler
Create a `handler.mjs` file to handle image checks and transformations.

Install dependencies:

```bash
npm install --arch=x64 --platform=linux --libc=glibc sharp
```

# Step 7: Deployment
First, make sure you've set up AWS credentials. Then:

```bash
serverless create_domain
serverless deploy
```

Check the CloudFormation in your AWS dashboard to see the resources being created.

## How to Test
You can use **Postman** or any other **HTTP client** to send requests to the custom domain you've set up.

## Troubleshooting & Tips
This implementation has room for improvements and adjustments. Check the full guide at [here](https://medium.com/@iwaduarte/aws-using-api-gateway-for-s3-uploads-to-trigger-lambda-functions-a4deeab5424c) for details on what could be optimized or added for your specific needs.

## Additional Resources
[Complete Guide: AWS - API Gateway to S3 to trigger lambdas](https://medium.com/@iwaduarte/aws-using-api-gateway-for-s3-uploads-to-trigger-lambda-functions-a4deeab5424c)  
[Serverless Documentation](https://www.serverless.com/)    
[AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/index.html)  
[AWS API Gateway Documentation](https://docs.aws.amazon.com/apigateway/index.html)  

## Happy coding!
