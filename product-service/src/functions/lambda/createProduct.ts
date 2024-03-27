import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import DynamoDbService from 'src/database/DynamoDbService';
import { schemas } from '../../utils/schema';
import { ErrorMessages } from 'src/messages';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schemas.json.createProduct> = async (event) => {
  const schema = schemas.joi.createProduct;

  try {
    const { error } = schema.validate(event.body, { presence: 'required' });
    if (error) {
      return formatJSONResponse({ message: error.message }, 400);
    }

    const newProduct = await DynamoDbService.save(event.body);

    return formatJSONResponse({ message: newProduct });
  } catch (err) {
    return formatJSONResponse({ message: ErrorMessages.InternalServerError });
  }
};

export const main = middyfy(createProduct);
