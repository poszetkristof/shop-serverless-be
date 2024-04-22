import csv from 'csv-parser';
import { S3Client, GetObjectCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { winstonLogger } from 'src/utils/logger/winston-logger';

const { BUCKET_NAME, REGION, SQS_URL } = process.env;
const s3Client = new S3Client({ region: REGION });
const sqsClient = new SQSClient({ region: REGION });

export const sendCsvRecordIntoSqs = async (results: never[]) => {
  winstonLogger.logRequest('Sending csv records to sqs...');
  results.map(async item => {
    const messageBody = JSON.stringify(item);
    const sqsParams = {
      QueueUrl: SQS_URL,
      MessageBody: messageBody,
    };
    try {
      await sqsClient.send(new SendMessageCommand(sqsParams));
      winstonLogger.logRequest('Converted CSV record send');
    } catch (err) {
      winstonLogger.logError(`Failed to send converted csv record, ${err}`);
    }
  })
}

export const importFileParser = async (event) => {
  if (!event.Records) {
    winstonLogger.logError('Record not found in importFileParser.ts lambda.');
    return;
  }

  for (const record of event.Records) {
    const getObjectParams = {
      Bucket: BUCKET_NAME,
      Key: record.s3.object.key,
    };

    const { Body: s3Stream } = await s3Client.send(new GetObjectCommand(getObjectParams));

    const results = [];
    await new Promise((resolve, reject) => {
      s3Stream
        ?.pipe(csv())
        .on('data', (data: never) => {
          results.push(data);
        })
        .on('error', reject)
        .on('end', resolve);
    });

    // Convert CSV data to JSON
    const jsonData = JSON.stringify(results);

    // Upload JSON data to 'parsed' folder
    const putObjectParams = {
      Bucket: BUCKET_NAME,
      Key: record.s3.object.key.replace('uploaded', 'parsed').replace('.csv', '') + '.json',
      Body: jsonData,
    };

    await s3Client.send(new PutObjectCommand(putObjectParams));

    winstonLogger.logRequest(`Copied into ${BUCKET_NAME}/${record.s3.object.key.replace('uploaded', 'parsed')}`);

    // Delete the original file
    const deleteObjectParams = {
      Bucket: BUCKET_NAME,
      Key: record.s3.object.key,
    };

    await s3Client.send(new DeleteObjectCommand(deleteObjectParams));

    winstonLogger.logRequest(`Deleted from ${BUCKET_NAME}/${record.s3.object.key}`);

    await sendCsvRecordIntoSqs(results);
  }
};
