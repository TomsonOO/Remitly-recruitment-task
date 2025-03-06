import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import {SwiftCodeController} from "./Infrastructure/Controller/SwiftCodeController";
import {GetSwiftCodeDetailsQueryHandler} from "./Application/GetSwiftCodeDetails/GetSwiftCodeDetailsQueryHandler";
import {PostgresSwiftCodeRepository} from "./Infrastructure/Persistence/PostgresSwiftCodeRepository";
import {SwiftCodeEntity} from "./Domain/swift-code.entity";

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
        }),
        TypeOrmModule.forFeature([SwiftCodeEntity]),
        CqrsModule,
    ],
    controllers: [SwiftCodeController],
    providers: [
        GetSwiftCodeDetailsQueryHandler,
        {
            provide: 'SwiftCodeRepositoryPort',
            useClass: PostgresSwiftCodeRepository,
        }
    ],
})
export class BankRegistryModule {}



