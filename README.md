## Endpoint

| mehtods | url              | auth     |
| :------ | :--------------- | -------- |
| GET     | /home            | everyone |
| GET     | /home/:id        | everyone |
| POST    | /home            | realtor  |
| PUT     | /home/:id        | realtor  |
| DELETE  | /home/:id        | realtor  |
| POST    | /home/:id        | realtor  |
| POST    | /auth/buyer      |          |
| POST    | /auth/realtor    |          |
| POST    | /auth/admin      |          |
| POST    | /auth/signin     |          |
| POST    | /auth/productkey |          |
| GET     | /auth/me         |          |

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
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
