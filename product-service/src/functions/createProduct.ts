import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/lambda/createProduct.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
      }
    },
  ],
};
