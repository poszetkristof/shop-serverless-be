import type { AWS } from '@serverless/typescript';

import { importProductsFile, importFileParser } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      BUCKET_NAME: 'bucket-import-products-file-hw5',
      FOLDER_NAME: 'uploaded',
      REGION: 'eu-west-1',
      SQS_URL: 'https://sqs.eu-west-1.amazonaws.com/992382569213/catalogItemsQueue'
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 's3:ListBucket',
            Resource: ['arn:aws:s3:::bucket-import-products-file-hw5'],
          },
          {
            Effect: 'Allow',
            Action: 's3:*',
            Resource: ['arn:aws:s3:::bucket-import-products-file-hw5/*'],
          },
          {
            Effect: "Allow",
            Action: ["sqs:SendMessage", "sqs:ReceiveMessage", "sqs:GetQueueAttributes"],
            Resource: "arn:aws:sqs:eu-west-1:992382569213:catalogItemsQueue",
          },
          {
            Effect: "Allow",
            Action: ["lambda:InvokeFunction"],
            Resource: [
              "arn:aws:lambda:eu-west-1:992382569213:function:authorization-service-dev-basicAuthorizer",
            ],
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    importProductsFile: {
      ...importProductsFile,
      events: [
        {
          http: {
            ...importProductsFile.events[0].http,
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true,
                },
              },
            },
            authorizer: {
              name: 'basicAuthorizer',
              arn: 'arn:aws:lambda:eu-west-1:992382569213:function:authorization-service-dev-basicAuthorizer',
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'token',
            },
          },
        },
      ],
    },
    importFileParser,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
          },
          ResponseType: "DEFAULT_4XX",
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
