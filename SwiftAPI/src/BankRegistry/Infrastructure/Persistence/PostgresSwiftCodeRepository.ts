import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SwiftCodeRepositoryPort } from '../../Application/Port/SwiftCodeRepositoryPort';
import { SwiftCodeEntity } from '../../Domain/swift-code.entity';
import { SwiftCodeWithBankCountry } from '../../Application/Port/types';
import { CountrySwiftCodesDto } from '../../Application/DTO/CountrySwiftCodesDto';

@Injectable()
export class PostgresSwiftCodeRepository implements SwiftCodeRepositoryPort {
  constructor(
    @InjectRepository(SwiftCodeEntity)
    private readonly repository: Repository<SwiftCodeEntity>,
  ) {}

  async findSwiftCodeWithBankAndCountry(
    swiftCode: string,
  ): Promise<SwiftCodeWithBankCountry | null> {
    const result = await this.repository.findOne({
      where: { swiftCode },
      relations: ['bank', 'address', 'address.country'],
    });
    if (!result) return null;

    return {
      swiftCode: result.swiftCode,
      isHeadquarter: result.isHeadquarter,
      bankName: result.bank.name,
      address: result.address.address,
      countryISO2: result.address.country.iso2Code,
      countryName: result.address.country.name,
    };
  }

  async findBranchesByHeadquarter(
    swiftCodeHeadquarter: string,
  ): Promise<SwiftCodeWithBankCountry[]> {
    const headquarter = await this.repository.findOne({
      where: { swiftCode: swiftCodeHeadquarter },
      relations: ['bank'],
    });
    if (!headquarter) {
      return [];
    }
    const bankId = headquarter.bank.id;

    const branches = await this.repository.find({
      where: { bank: { id: bankId }, isHeadquarter: false },
      relations: ['bank', 'address', 'address.country'],
    });
    return branches.map((b) => ({
      swiftCode: b.swiftCode,
      isHeadquarter: b.isHeadquarter,
      bankName: b.bank.name,
      address: b.address.address,
      countryISO2: b.address.country.iso2Code,
      countryName: b.address.country.name,
    }));
  }
  async findByCountry(
    countryISO2: string,
  ): Promise<CountrySwiftCodesDto | null> {
    const swiftCodes = await this.repository
      .createQueryBuilder('swiftCode')
      .leftJoinAndSelect('swiftCode.bank', 'bank')
      .leftJoinAndSelect('swiftCode.address', 'address')
      .leftJoinAndSelect('address.country', 'country')
      .where('country.iso2Code = :countryISO2', {
        countryISO2: countryISO2.toUpperCase(),
      })
      .getMany();

    if (!swiftCodes.length) {
      return null;
    }

    const country = swiftCodes[0].address.country;

    return {
      countryISO2: country.iso2Code,
      countryName: country.name,
      swiftCodes: swiftCodes.map((code) => ({
        address: code.address.address,
        bankName: code.bank.name,
        countryISO2: country.iso2Code,
        isHeadquarter: code.isHeadquarter,
        swiftCode: code.swiftCode,
      })),
    };
  }
}
