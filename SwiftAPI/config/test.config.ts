import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const testDbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.TEST_DB_HOST || 'test-db',
    port: parseInt(process.env.TEST_DB_PORT || '5432', 10),
    username: process.env.TEST_DB_USER || 'test_user',
    password: process.env.TEST_DB_PASSWORD || 'test_password',
    database: process.env.TEST_DB_NAME || 'test_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false
};