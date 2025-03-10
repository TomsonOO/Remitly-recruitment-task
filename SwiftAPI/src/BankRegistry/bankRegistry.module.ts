import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import {SwiftCodeController} from "./Infrastructure/Controller/SwiftCodeController";
import {GetSwiftCodeDetailsQueryHandler} from "./Application/GetSwiftCodeDetails/GetSwiftCodeDetailsQueryHandler";
import {PostgresSwiftCodeRepository} from "./Infrastructure/Persistence/PostgresSwiftCodeRepository";
import {SwiftCodeEntity} from "./Domain/swift-code.entity";
import {
    GetSwiftCodesForCountryQueryHandler
} from "./Application/GetSwiftCodesForCountry/GetSwiftCodesForCountryQueryHandler";
import { SwiftCodeExcelImporter } from './Infrastructure/Import/SwiftCodeExcelImporter';
import { CountryEntity } from './Domain/country.entity';
import { BankEntity } from './Domain/bank.entity';
import { AddressEntity } from './Domain/address.entity';

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
        TypeOrmModule.forFeature([
            SwiftCodeEntity,
            CountryEntity,
            BankEntity,
            AddressEntity
        ]),
        CqrsModule,
    ],
    controllers: [SwiftCodeController],
    providers: [
        GetSwiftCodeDetailsQueryHandler,
        GetSwiftCodesForCountryQueryHandler,
        SwiftCodeExcelImporter,
        {
            provide: 'SwiftCodeRepositoryPort',
            useClass: PostgresSwiftCodeRepository,
        }
    ],
    exports: [SwiftCodeExcelImporter]
})
export class BankRegistryModule {}
