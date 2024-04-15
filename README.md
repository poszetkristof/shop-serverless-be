# shop-serverless-be

## How to deploy product service:
  - `cd product-service/`
  - `npm i`
  - `npm run serverless:deploy` OR `npx sls deploy`

*For further details, check README.md inside `product-service` or `import-service`*

## How to create a service:
- Templates created using the command: `serverless create --template aws-nodejs-typescript --path <my-service>`
- [CLI reference](https://www.serverless.com/framework/docs/providers/aws/cli-reference/create)
