import csv from 'csv-parser';

import { S3Client, GetObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
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

    s3Stream
      ?.pipe(csv())
      .on('data', (data) => {
        winstonLogger.logRequest(JSON.stringify(data));
      })
      .on('end', async () => {
        winstonLogger.logRequest(`Copy from ${BUCKET_NAME}/${record.s3.object.key}`);

        const copyObjectParams = {
          Bucket: BUCKET_NAME,
          CopySource: `${BUCKET_NAME}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace('uploaded', 'parsed'),
        };

        await s3Client.send(new CopyObjectCommand(copyObjectParams));

        winstonLogger.logRequest(`Copied into ${BUCKET_NAME}/${record.s3.object.key.replace('uploaded', 'parsed')}`);
      });
  }
};
