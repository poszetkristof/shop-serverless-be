import type { CustomAuthorizerResult, PolicyDocument } from 'aws-lambda';
import type { Effect } from 'src/types';

export const generatePolicy = (principalId: string, effect: Effect, resource: string): CustomAuthorizerResult => {
  const policyDocument: PolicyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  };

  return {
    principalId,
    policyDocument,
  };
};
