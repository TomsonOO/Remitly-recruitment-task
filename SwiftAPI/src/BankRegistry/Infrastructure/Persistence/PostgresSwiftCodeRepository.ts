import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SwiftCodeRepositoryPort } from '../../Application/Port/SwiftCodeRepositoryPort';
import { SwiftCodeEntity } from '../../Domain/swift-code.entity';
import { SwiftCodeWithBankCountry } from '../../Application/Port/types';

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
}
