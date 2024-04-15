import csv from 'csv-parser';
import { S3Client, GetObjectCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { winstonLogger } from 'src/utils/logger/winston-logger';

const { BUCKET_NAME, REGION } = process.env;
const s3Client = new S3Client({ region: REGION });

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

    const csvData = [];
    await new Promise((resolve, reject) => {
      s3Stream
        ?.pipe(csv())
        .on('data', (data: never) => {
          csvData.push(data);
        })
        .on('error', reject)
        .on('end', resolve);
    });

    // Convert CSV data to JSON
    const jsonData = JSON.stringify(csvData);

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
  }
};
