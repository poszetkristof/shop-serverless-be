import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/lambda/getProductById.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        request: {
          parameters: {
            paths: {
              productId: true,
            }
          }
        }
      },
    },
  ],
};