import { formatJSONResponse } from '@libs/api-gateway';
import { products } from '../../../../mocks/data';
import { middyfy } from '@libs/lambda';

import type { APIGatewayProxyEvent } from 'aws-lambda';

const getProductById = async (event: APIGatewayProxyEvent) => {
  const productId = event.pathParameters?.productId;

  if (!productId) {
    return formatJSONResponse({ message: 'Missing productId param' }, 400);
  }

  const product = products.find(product => product.id === productId);

  if (!product) {
    return formatJSONResponse({ message: 'Product not found' }, 404);
  }

  return formatJSONResponse({ message: product });
};

export const main = middyfy(getProductById);
