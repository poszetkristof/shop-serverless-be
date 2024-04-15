import type { AWS } from '@serverless/typescript';

import { productById, products, createProduct, catalogBatchProcess } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
      PRODUCTS_TABLE: 'products',
      STOCKS_TABLE: 'stocks',
      CREATE_PRODUCT_TOPIC_SNS_ARN: "arn:aws:sns:eu-west-1:992382569213:createProductTopic",
      CATALOG_ITEMS_QUEUE_ARN: "arn:aws:sqs:eu-west-1:992382569213:catalogItemsQueue",
    },
    iam: {
      role: {
        statements: [{
          Effect: "Allow",
          Action: [
            "dynamodb:DescribeTable",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
          ],
          Resource: 'arn:aws:dynamodb:eu-west-1:*:table/*',
        },
        {
          Effect: "Allow",
          Action: ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
          Resource: {
            "Fn::GetAtt": ["catalogItemsQueue", "Arn"],
          },
        },
        {
          Effect: "Allow",
          Action: [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
            "logs:DescribeLogGroups",
            "logs:DescribeLogStreams",
          ],
          Resource: "arn:aws:logs:*:*:*",
        },
        {
          Effect: "Allow",
          Action: "sns:Publish",
          Resource: "arn:aws:sns:eu-west-1:992382569213:createProductTopic",
        },
        ],
      },
    },
  },
  // import the function via paths
  functions: {
    products: {
      ...products,
      events: [
        { http: { ...products.events[0].http, cors: true } }
      ]
    },
    productById: {
      ...productById,
      events: [
        { http: { ...productById.events[0].http, cors: true } }
      ]
    },
    createProduct: {
      ...createProduct,
      events: [
        { 
          http: {
            method: createProduct.events[0].http.method,
            path: createProduct.events[0].http.path,
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess
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
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue',
        },
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
        },
      },
      createProductTopicSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'poszetrj@gmail.com',
          Protocol: 'email',
          TopicArn: { 'Ref': 'createProductTopic' },
        },
      },
    }
  }
};

module.exports = serverlessConfiguration;
