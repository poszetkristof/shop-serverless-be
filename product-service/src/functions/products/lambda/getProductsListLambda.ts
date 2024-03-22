import { formatJSONResponse } from '@libs/api-gateway';
import { products } from '../../../../mocks/data';
import { middyfy } from '@libs/lambda';

const getProductsList = async () => formatJSONResponse({
  message: products,
});

export const main = middyfy(getProductsList);
