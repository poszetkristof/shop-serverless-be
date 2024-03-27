import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import DynamoDbService from "src/database/DynamoDbService";
import { ProductDatabaseService } from 'src/database/ProductDatabaseService';

const getProductsList = (productService: ProductDatabaseService) => async () => formatJSONResponse({
  message: await productService.find(),
});

export const main = middyfy(getProductsList(DynamoDbService));
