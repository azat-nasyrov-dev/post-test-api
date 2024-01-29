## Description
- Back-end test project on Node.js and Nest.js

## Installation

## Environment
- Run command cp .env.example .env

```bash
# development
$ npm install
```

# Running the app

```bash
# development
$ npm run start:dev
```

# Details of database and migration

```bash
# database creation
$ npm run typeorm migration:generate

# pulling up the database
$ npm run typeorm migration:run

# deleting database
$ npm run typeorm schema:drop
```

## Swagger project documentation
- This link leads to the API documentation (http://localhost:3001/api/docs)