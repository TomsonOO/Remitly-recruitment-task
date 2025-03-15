# SWIFT Codes API

Project created as part of a recruitment task.

## Technology Stack

- TypeScript
- NestJS
- PostgreSQL
- Docker

## Installation

1. Configure environment variables:
```bash
cp .env.example .env
# Edit .env to provide your database credentials
```

2. Start the application:
```bash
docker compose up -d
```
3. Run database migrations:

    dev + test database: 
```bash
 docker compose run backend  npx typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts
 ```

```bash
docker compose run backend  npx typeorm-ts-node-commonjs migration:run -d src/database/test-data-source.ts
```
If there's problem with running migration, alternative option is to change`  synchronize: false
` to `  synchronize: true` in `src/database/test-data-source.ts` and `src/database/test-data-source.ts` and then restart docker containers.

4. Import SWIFT codes data (optional):
```bash
# Excel file should be placed in the resourced catalog
docker exec SwiftAPI npm run import-swift-codes resources/swift-codes.xlsx
```

The API will be available at http://localhost:8080

### Testing

1. Configure test environment - provide credentials in .env for testing db

2. Start the application with the test DB:
```bash
docker compose --profile test up -d
```

Note: In case of docker network errors, add `--force-recreate`:
```bash
docker compose --profile test up --force-recreate -d
```
3. Run tests:
```
npm test
```


