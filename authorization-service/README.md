# Authorization Service
- This service contains a `basicAuthorizer` lambda that should take Basic Authorization token, decode it and check that credentials provided by token exist in the lambda environment variable.
- This lambda should return 403 HTTP status if access is denied for this user and 401 HTTP status if Authorization header is not provided.

## Installation/deployment instructions
- `npm i` to install the project dependencies
- `npm run serverless:deploy` to deploy this stack to AWS
- `npm run serverless:remove` to remove this stack from AWS

## Project structure
- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas
- `utils` - utilities like logger
```
.
├── src
│   ├── functions                   # Lambda configuration and source code folder
│   │   ├── lambda
│   │   │   ├── basicAuthorizer.ts  # `basicAuthorizer` lambda source code
│   │   ├── basicAuthorizer.ts      # `basicAuthorizer` lambda Serverless configuration
│   │   │
│   │   └── index.ts                # Import/export of all lambda configurations
│   │
│   └── libs                        # Lambda shared code
│       └── handler-resolver.ts     # Sharable library for resolving lambda handlers
│       └── generate-policy.ts      # Policy document to return instead of HTTP response. This tells API Gateway what actions the current user is allowed to perform.
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### Usage
- provide `.env` file with similar key-value pairs like in `.env.example`
- Postman:
  - select GET or POST HTTP method
  - click `Authorization` tab below the URL field
  - from `Type` dropdown menu, select `Basic Auth`
  - fill in the `Username` and `Password` fields with the ones provided in `.env` file
