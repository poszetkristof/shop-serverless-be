## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Important notes
- all dependencies were updated on May 9, 2025
- Node version used locally: `v21.6.2`
- to [fix errors](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/49595) with `@types/express`, run commands:
  ```bash
  npm update @types/express-serve-static-core --depth 2
  npm update @types/serve-static --depth 2
  ```

## Running the app

```bash
# serverless offline
$ npm run serverless:start:offline

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
