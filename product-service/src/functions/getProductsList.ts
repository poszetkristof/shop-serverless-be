import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/lambda/getProductsList.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products'
      },
    },
  ],
};
