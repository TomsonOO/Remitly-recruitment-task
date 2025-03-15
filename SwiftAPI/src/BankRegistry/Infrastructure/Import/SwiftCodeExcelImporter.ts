import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { SwiftCodeExcelRow } from './SwiftCodeExcelRow.interface';
import { CountryEntity } from '../../Domain/country.entity';
import { BankEntity } from '../../Domain/bank.entity';
import { AddressEntity } from '../../Domain/address.entity';
import { SwiftCodeEntity } from '../../Domain/swift-code.entity';

@Injectable()
export class SwiftCodeExcelImporter {
  private readonly logger = new Logger(SwiftCodeExcelImporter.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
    @InjectRepository(BankEntity)
    private readonly bankRepository: Repository<BankEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    @InjectRepository(SwiftCodeEntity)
    private readonly swiftCodeRepository: Repository<SwiftCodeEntity>,
  ) {}

  async import(filePath: string): Promise<void> {
    this.logger.log(`Starting SWIFT codes import from ${filePath}`);

    try {
      const rows = this.readExcelFile(filePath);
      await this.processRows(rows);
      this.logger.log('Import completed successfully');
    } catch (error) {
      this.logger.error(`Import failed: ${error.message}`);
      throw error;
    }
  }

  private readExcelFile(filePath: string): SwiftCodeExcelRow[] {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      return XLSX.utils.sheet_to_json<SwiftCodeExcelRow>(sheet);
    } catch (error) {
      throw new Error(`Failed to read Excel file: ${error.message}`);
    }
  }

  private async processRows(rows: SwiftCodeExcelRow[]): Promise<void> {
    for (const [index, row] of rows.entries()) {
      try {
        await this.dataSource.transaction(
          async (transactionalEntityManager) => {
            await this.processRow(row, transactionalEntityManager);
          },
        );
        this.logger.debug(`Processed row ${index + 1}/${rows.length}`);
      } catch (error) {
        this.logger.error(
          `Failed to process row ${index + 1}: ${error.message}`,
        );
        if (!error.message.includes('duplicate key value')) {
          throw error;
        }
        this.logger.warn(
          `Skipping duplicate SWIFT code entry and continuing with import`,
        );
      }
    }
  }

  private async processRow(
    row: SwiftCodeExcelRow,
    manager: EntityManager,
  ): Promise<void> {
    const country = await this.findOrCreateCountry(row, manager);
    const address = await this.findOrCreateAddress(row, country, manager);
    const bank = await this.findOrCreateBank(row, manager);
    await this.findOrCreateSwiftCode(row, bank, address, manager);
  }

  private async findOrCreateCountry(
    row: SwiftCodeExcelRow,
    manager: EntityManager,
  ): Promise<CountryEntity> {
    const countryISO2Code = row['COUNTRY ISO2 CODE'].trim().toUpperCase();
    const countryName = row['COUNTRY NAME'].trim().toUpperCase();

    let country = await manager.findOne(CountryEntity, {
      where: { name: countryName },
    });

    if (!country) {
      country = manager.create(CountryEntity, {
        iso2Code: countryISO2Code,
        name: countryName,
      });
      country = await manager.save(CountryEntity, country);
      this.logger.debug(`Created new country: ${countryName}`);
    }

    return country;
  }

  private async findOrCreateAddress(
    row: SwiftCodeExcelRow,
    country: CountryEntity,
    manager: EntityManager,
  ): Promise<AddressEntity> {
    const addressValue = row['ADDRESS'].trim().toUpperCase();
    const townNameValue = row['TOWN NAME'].trim().toUpperCase();

    let address = await manager.findOne(AddressEntity, {
      where: {
        address: addressValue,
        townName: townNameValue,
        country: { id: country.id },
      },
    });

    if (!address) {
      address = manager.create(AddressEntity, {
        address: addressValue,
        townName: townNameValue,
        country: country,
      });
      address = await manager.save(AddressEntity, address);
      this.logger.debug(
        `Created new address: ${addressValue}, ${townNameValue}`,
      );
    }

    return address;
  }

  private async findOrCreateBank(
    row: SwiftCodeExcelRow,
    manager: EntityManager,
  ): Promise<BankEntity> {
    const bankName = row['NAME'].trim().toUpperCase();

    let bank = await manager.findOne(BankEntity, {
      where: { name: bankName },
    });

    if (!bank) {
      bank = manager.create(BankEntity, {
        name: bankName,
      });
      bank = await manager.save(BankEntity, bank);
      this.logger.debug(`Created new bank: ${bankName}`);
    }

    return bank;
  }

  private async findOrCreateSwiftCode(
    row: SwiftCodeExcelRow,
    bank: BankEntity,
    address: AddressEntity,
    manager: EntityManager,
  ): Promise<SwiftCodeEntity> {
    const swiftCodeValue = row['SWIFT CODE'].trim().toUpperCase();
    const isHeadquarter = swiftCodeValue.endsWith('XXX');

    let swiftCode = await manager.findOne(SwiftCodeEntity, {
      where: { swiftCode: swiftCodeValue },
    });

    if (!swiftCode) {
      swiftCode = manager.create(SwiftCodeEntity, {
        swiftCode: swiftCodeValue,
        isHeadquarter: isHeadquarter,
        bank: bank,
        address: address,
      });
      await manager.save(SwiftCodeEntity, swiftCode);
      this.logger.debug(`Created new SWIFT code: ${swiftCodeValue}`);
    }

    return swiftCode;
  }
}
