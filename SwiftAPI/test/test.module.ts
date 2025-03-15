import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { testDbConfig } from '../config/test.config';
import { SwiftCodeController } from '../src/BankRegistry/Infrastructure/Controller/SwiftCodeController';
import { GetSwiftCodeDetailsQueryHandler } from '../src/BankRegistry/Application/GetSwiftCodeDetails/GetSwiftCodeDetailsQueryHandler';
import { PostgresSwiftCodeRepository } from '../src/BankRegistry/Infrastructure/Persistence/PostgresSwiftCodeRepository';
import { SwiftCodeEntity } from '../src/BankRegistry/Domain/swift-code.entity';
import { GetSwiftCodesForCountryQueryHandler } from '../src/BankRegistry/Application/GetSwiftCodesForCountry/GetSwiftCodesForCountryQueryHandler';
import { SwiftCodeExcelImporter } from '../src/BankRegistry/Infrastructure/Import/SwiftCodeExcelImporter';
import { CountryEntity } from '../src/BankRegistry/Domain/country.entity';
import { BankEntity } from '../src/BankRegistry/Domain/bank.entity';
import { AddressEntity } from '../src/BankRegistry/Domain/address.entity';
import { CreateSwiftCodeCommandHandler } from '../src/BankRegistry/Application/CreateSwiftCode/CreateSwiftCodeCommandHandler';
import { DeleteSwiftCodeCommandHandler } from '../src/BankRegistry/Application/DeleteSwiftCode/DeleteSwiftCodeCommandHandler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(testDbConfig),
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
    CreateSwiftCodeCommandHandler,
    DeleteSwiftCodeCommandHandler,
    {
      provide: 'SwiftCodeRepositoryPort',
      useClass: PostgresSwiftCodeRepository,
    },
  ],
  exports: [SwiftCodeExcelImporter],
})
export class TestModule {}