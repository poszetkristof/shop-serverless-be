## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

Execute the SQL scripts from `initdb.sql`.

## Important notes
- all dependencies were updated on May 9, 2025
- Node version used locally: `v21.6.2`
- to [fix errors](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/49595) with `@types/express`, run commands:
  ```bash
  npm update @types/express-serve-static-core --depth 2
  npm update @types/serve-static --depth 2
  ```
### Additional configurations to be able to integrate the DB:
#### Create a New Parameter Group:
- Open the Amazon RDS console at https://console.aws.amazon.com/rds/.
- In the navigation pane, choose "Parameter groups".
- Click "Create parameter group" at the top right of the page.
- In the "Parameter group family" dropdown, select "postgres15".
- In the "Group name" field, enter a name for the new parameter group.
- In the "Description" field, enter a description for the new parameter group.
- Click "Create" at the bottom right of the page.
#### Modify the rds.force_ssl Parameter of your new Parameter Group:
- In the list of parameter groups, click on the name of the new parameter group you just created.
- In the "Filter parameters" box, type rds.force_ssl and press Enter.
- You should see the rds.force_ssl parameter. Click "Edit parameters".
- Change the value of rds.force_ssl from 1 to 0, then click "Save changes".
#### Associate Your RDS Instance with the New Parameter Group:
- In the navigation pane, choose "Databases".
- Click on the name of your RDS instance.
- Click "Modify" at the top right of the page.
- In the "Database options" section, find the "DB parameter group" setting and select the new parameter group you created from the dropdown menu.
- Scroll down and click "Continue".
- Review the summary of modifications and click "Modify DB Instance".
#### Reboot Your RDS Instance:
- In the navigation pane, choose "Databases".
- Click on the name of your RDS instance.
- Click "Actions" at the top right of the page, then "Reboot".
- Confirm that you want to reboot the instance.
[reference](https://stackoverflow.com/questions/76899023/rds-while-connection-error-no-pg-hba-conf-entry-for-host)

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
