import type { APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import { generatePolicy } from '@libs/generate-policy';
import { EFFECTS } from 'src/constants';
import { winstonLogger } from 'src/utils/logger/winston-logger';

const decodeCredentials = (encodedCredentials: string): [string, string] => {
  const buffer = Buffer.from(encodedCredentials, 'base64');
  return buffer.toString('utf8').split(':') as [string, string];
};

const basicAuthorizer = async ({ authorizationToken, methodArn }: APIGatewayTokenAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  if (!authorizationToken) {
    winstonLogger.logError('Unauthorized user tried to log in');
    throw new Error('Unauthorized');
  }

  const encodedCredentials = authorizationToken.split(' ')[1];
  const [username, password] = decodeCredentials(encodedCredentials);

  const effect = process.env[username] === password ? EFFECTS.ALLOW : EFFECTS.DENY;

  return generatePolicy(encodedCredentials, effect, methodArn);
};

export const main = basicAuthorizer;
