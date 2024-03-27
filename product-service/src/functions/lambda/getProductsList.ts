import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const dynamoDb = new DynamoDBClient();
const docClient = DynamoDBDocumentClient.from(dynamoDb);

const scan = async () => {
  const command = new ScanCommand({ TableName: process.env.PRODUCTS_TABLE });
  const { Items } = await docClient.send(command);
  return Items;
}

const getProductsList = async () => formatJSONResponse({
  message: await scan(),
});

export const main = middyfy(getProductsList);
