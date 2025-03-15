import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'SwiftUser',
  password: process.env.DB_PASSWORD || 'SwiftPassword',
  database: process.env.DB_NAME || 'SwiftDB',
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'migrations', '**', '*{.ts,.js}')],
  synchronize: false,
  logging: false,
}); 