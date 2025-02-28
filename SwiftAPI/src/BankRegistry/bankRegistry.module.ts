import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'db',
            port: parseInt(process.env.DB_PORT ?? '5432', 10),
            username: process.env.DB_USER || 'SwiftUser',
            password: process.env.DB_PASSOWRD || 'SwiftPassword',
            database: process.env.DB_NAME || 'SwiftDB',
            entities: [
                __dirname + '/**/*.entity{.ts,.js}',
            ],
            synchronize: true,


        })



    ],
    controllers: [],
    providers: [],
})
export class BankRegistryModule {}