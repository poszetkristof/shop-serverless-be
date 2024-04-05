import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import type { APIGatewayProxyEvent } from 'aws-lambda';

const importProductsFile = async (event: APIGatewayProxyEvent) => {
  return formatJSONResponse({
    message: `Hello ${event.path}, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = middyfy(importProductsFile);
