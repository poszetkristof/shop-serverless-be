import { DynamoDB, config } from 'aws-sdk';
import { products } from '../mocks/data';
import { TABLE_NAMES } from '../constants';

const dynamoDb = new DynamoDB.DocumentClient();
config.update({ region: process.env.AWS_REGION });

const populateTable = async <T extends DynamoDB.DocumentClient.PutItemInputAttributeMap>(tableName: string, items: T[]) => {
  for (const item of items) {
    await dynamoDb.put({
      TableName: tableName,
      Item: item
    }).promise();
  }
}

populateTable(TABLE_NAMES.PRODUCTS, products).catch((error) => console.error(error));
