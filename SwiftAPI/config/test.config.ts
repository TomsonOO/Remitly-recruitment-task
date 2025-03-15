import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const testDbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.TEST_DB_HOST || 'test-db',
    port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
    username: process.env.TEST_DB_USER || 'test_user',
    password: process.env.TEST_DB_PASSWORD || 'test_password',
    database: process.env.TEST_DB_NAME || 'test_db',
    entities: [join(__dirname, '..', 'src', '**', '*.entity{.ts,.js}')],
    synchronize: false,
    migrations: [join(__dirname, '..', 'src', 'database', 'migrations', '**', '*{.ts,.js}')],
    migrationsRun: false,
    logging: process.env.NODE_ENV === 'debug',
    autoLoadEntities: true
};