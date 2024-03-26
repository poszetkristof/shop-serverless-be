import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { TABLE_NAMES } from '../../../../constants';

const dynamoDb = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamoDb);

const scan = async () => {
  const command = new ScanCommand({ TableName: TABLE_NAMES.PRODUCTS });
  const products = await docClient.send(command);

  return products;
}

const getProductsList = async () => formatJSONResponse({
  message: (await scan()).Items,
});

export const main = middyfy(getProductsList);
