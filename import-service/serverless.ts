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
};

module.exports = serverlessConfiguration;
