import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import DynamoDbService from 'src/database/DynamoDbService';
import type { SQSEvent } from 'aws-lambda';
import { ProductWithoutId } from 'src/types/product';
import { formatJSONResponse } from '@libs/api-gateway';
import { ErrorMessages } from 'src/messages';

const snsClient = new SNSClient({ region: process.env.REGION });

const processBatchRequest = async (event: SQSEvent) => {
  for (const record of event.Records) {
    console.log('Processing record: ', record.body);

    const product: ProductWithoutId = JSON.parse(record.body);
    await DynamoDbService.save(product);

    const snsParams = {
      TopicArn: process.env.CREATE_PRODUCT_TOPIC_SNS_ARN,
      Subject: 'New product saved',
      Message: JSON.stringify(product),
      MessageAttributes: {
        title: {
          DataType: 'String',
          StringValue: product.title
        }
      },
    };
  
    await snsClient.send(new PublishCommand(snsParams));
  }
}

const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    await processBatchRequest(event);
    return formatJSONResponse({ message: 'Product saved successfully' });
  } catch (err) {
    console.error('Failed to process batch ', err);
    return formatJSONResponse({ message: ErrorMessages.InternalServerError });
  }
};

export const main = catalogBatchProcess;
