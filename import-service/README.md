## Deploy:
```shell
npm run serverless:deploy
```

## Check lambdas locally
```shell
npm run check:importProductsFile
```
```shell
npm run check:importFileParser
```

## Prerequisites
- create an S3 bucket, with the exact name: `bucket-import-products-file-hw5`
- within bucket, create 2 folders:
  - `parsed`
  - `uploaded`
- permissions
  - block all public access: `On` (*for testing purposes, might be unblocked for a few minutes*)
  - add bucket policy
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "AllowPublicRead",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "*"
                },
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::bucket-import-products-file-hw5/*"
            }
        ]
    }
    ```
  - Add CORS policy (still in `Permissions` tab, using AWS console)
    ```json
    [
        {
            "AllowedHeaders": [
                "*"
            ],
            "AllowedMethods": [
                "PUT",
                "GET",
                "HEAD"
            ],
            "AllowedOrigins": [
                "*"
            ],
            "ExposeHeaders": []
        }
    ]
    ```
  - in order to use **SQS, SNS**, might need to set up using AWS console:
    - Amazon SQS --> Queues --> catalogItemsQueue --> select SNS subscription --> `Subscribe to Amazon SNS Topic`
    - Amazon SNS --> Topics --> click createProductTopic --> if no subscriptions --> Create Subscription --> Select subscription --> edit fields:
      - protocol: Amazon SQS
      - endpoint: select the one which AWS offers (e.g. `arn:aws:sqs:eu-west-1:992382569213:catalogItemsQueue`)