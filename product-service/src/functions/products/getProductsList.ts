import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/lambda/getProductsListLambda.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products'
      },
    },
  ],
};
