import { middyfy } from '@libs/lambda';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { successResponse } from 'src/utils/api/api-response-builder';

const importProductsFile = async (event: APIGatewayProxyEvent) => {
  return successResponse({
    message: 'Fresh stuff',
    event,
  });
};

export const main = middyfy(importProductsFile);
