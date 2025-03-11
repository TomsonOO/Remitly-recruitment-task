import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER || 'SwiftUser',
    password: process.env.DB_PASSWORD || 'SwiftPassword',
    database: process.env.DB_NAME || 'SwiftDB',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
};