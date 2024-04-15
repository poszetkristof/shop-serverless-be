import { middyfy } from '@libs/lambda';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import { successResponse, errorResponse } from 'src/utils/api/api-response-builder';

const { BUCKET_NAME, FOLDER_NAME, REGION } = process.env;
const s3Client = new S3Client({ region: REGION });

const importProductsFile = async (event: APIGatewayProxyEvent) => {
  try {
    const catalogName = event.queryStringParameters?.name;
    const catalogPath = `${FOLDER_NAME}/${catalogName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: catalogPath,
      ContentType: 'text/csv',
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return successResponse({ url });
  } catch (error) {
    return errorResponse(error);
  }
};

export const main = middyfy(importProductsFile);
