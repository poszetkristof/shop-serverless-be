import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/lambda/basicAuthorizer.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'auth',
        cors: {
          origin: '*',
          headers: ['Content-Type', 'Authorization', '*'],
          allowCredentials: true,
        },
      },
    },
  ],
};
