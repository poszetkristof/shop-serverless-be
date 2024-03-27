import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import DynamoDbService from "src/database/DynamoDbService";
import { ProductDatabaseService } from 'src/database/ProductDatabaseService';
import { ErrorMessages } from 'src/messages';

const getProductsList = (productService: ProductDatabaseService) => async (event: APIGatewayProxyEvent, context: Context) => {
  try {
    console.log('Incoming request: ', { event, context });
  
    const products = await productService.find();
    return formatJSONResponse({ message: products });
  } catch {
    return formatJSONResponse({ message: ErrorMessages.InternalServerError }, 500);
  }
}

export const main = middyfy(getProductsList(DynamoDbService));
