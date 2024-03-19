import { formatJSONResponse } from '@libs/api-gateway';
import { products } from '../../../mocks/data';

const getProductsList = async (_event) => formatJSONResponse({
  message: products,
});

export const main = getProductsList;
