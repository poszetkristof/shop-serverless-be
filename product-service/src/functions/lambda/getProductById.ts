import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import type { APIGatewayProxyEvent } from 'aws-lambda';
import DynamoDbService from 'src/database/DynamoDbService';
import { ErrorMessages } from 'src/messages';

const getProductById = async (event: APIGatewayProxyEvent) => {
  const productId = event.pathParameters?.productId;

  if (!productId) {
    return formatJSONResponse({ message: 'Missing productId param' }, 400);
  }

  try {
    const product = await DynamoDbService.findById(productId);

    if (!product) {
      return formatJSONResponse({ message: 'Product not found' }, 404);
    }

    return formatJSONResponse({ message: product });
  } catch{
    return formatJSONResponse({ message: ErrorMessages.InternalServerError }, 500);
  }
};

export const main = middyfy(getProductById);
