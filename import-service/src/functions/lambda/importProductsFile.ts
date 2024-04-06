import { middyfy } from '@libs/lambda';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { successResponse } from 'src/utils/apiResponseBuilder';

const importProductsFile = async (event: APIGatewayProxyEvent) => {
  return successResponse({
    message: `Hello more, welcome to the exciting Serverless world!`,
    event,
  });
};

export const main = middyfy(importProductsFile);
