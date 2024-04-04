// Used for checking the db service locally

import DynamoDbService from "./database/DynamoDbService";

DynamoDbService.find().then((resp) => console.log(resp));
DynamoDbService.findById('7567ec4b-b10c-48c5-9345-fc73c48a80aa').then((resp) => console.log(resp));
