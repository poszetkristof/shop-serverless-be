import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/lambda/importProductsFile.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
      },
    },
  ],
};
