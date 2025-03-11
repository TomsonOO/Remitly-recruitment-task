import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { SwiftCodeController } from './Infrastructure/Controller/SwiftCodeController';
import { GetSwiftCodeDetailsQueryHandler } from './Application/GetSwiftCodeDetails/GetSwiftCodeDetailsQueryHandler';
import { PostgresSwiftCodeRepository } from './Infrastructure/Persistence/PostgresSwiftCodeRepository';
import { SwiftCodeEntity } from './Domain/swift-code.entity';
import { GetSwiftCodesForCountryQueryHandler } from './Application/GetSwiftCodesForCountry/GetSwiftCodesForCountryQueryHandler';
import { SwiftCodeExcelImporter } from './Infrastructure/Import/SwiftCodeExcelImporter';
import { CountryEntity } from './Domain/country.entity';
import { BankEntity } from './Domain/bank.entity';
import { AddressEntity } from './Domain/address.entity';
import { databaseConfig } from '../../config/datbase.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([
      SwiftCodeEntity,
      CountryEntity,
      BankEntity,
      AddressEntity,
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
    },
  ],
  exports: [SwiftCodeExcelImporter],
})
export class BankRegistryModule {}
