import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/lambda/catalogBatchProcess.main`,
  events: [
    {
      sqs: {
        arn: 'arn:aws:sqs:eu-west-1:992382569213:catalogItemsQueue',
        batchSize: 5,
      },
    },
  ],
};
