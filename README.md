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

3. Import SWIFT codes data (optional):
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
3. Run tests:
```
npm test
```


