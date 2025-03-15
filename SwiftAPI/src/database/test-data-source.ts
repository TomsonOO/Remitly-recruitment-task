import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TEST_DB_HOST || 'TestDB',
  port: parseInt(process.env.TEST_DB_PORT || '5433', 10),
  username: process.env.TEST_DB_USER || 'TestUser',
  password: process.env.TEST_DB_PASSWORD || 'TestPassword',
  database: process.env.TEST_DB_NAME || 'TestDB',
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '**', '*{.ts,.js}')],
  synchronize: false,
  logging: false,
}); 