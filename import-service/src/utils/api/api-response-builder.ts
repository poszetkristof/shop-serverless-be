import { winstonLogger } from '../logger/winston-logger';
import type { ApiResponse } from './types';

const defaultHeaders = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
};

export const errorResponse = (err: Error, statusCode: number = 500): ApiResponse => {
  winstonLogger.logError(`Error: ${err?.message}`);

  return {
    statusCode,
    headers: { ...defaultHeaders },
    body: JSON.stringify({ message: err?.message ?? 'Something went wrong !!!' }),
  };
};

export const successResponse = (body: Object, statusCode = 200): ApiResponse => {
  winstonLogger.logRequest(`Lambda successfully invoked and finished`);

  return {
    statusCode,
    headers: { ...defaultHeaders },
    body: JSON.stringify(body),
  };
};
