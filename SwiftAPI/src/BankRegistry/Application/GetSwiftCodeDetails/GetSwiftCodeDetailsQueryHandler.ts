import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSwiftCodeDetailsQuery } from './GetSwiftCodeDetailsQuery';
import { SwiftCodeRepositoryPort } from '../Port/SwiftCodeRepositoryPort';
import { SwiftCodeDetailsDto } from '../DTO/SwiftCodeDetailsDto';
import { SwiftCodeWithBranchesDto } from '../DTO/SwiftCodeWithBranchesDto';
import { Inject } from '@nestjs/common';

@QueryHandler(GetSwiftCodeDetailsQuery)
export class GetSwiftCodeDetailsQueryHandler
  implements IQueryHandler<GetSwiftCodeDetailsQuery>
{
  constructor(
    @Inject('SwiftCodeRepositoryPort')
    private readonly swiftCodeRepository: SwiftCodeRepositoryPort,
  ) {}

  async execute(
    query: GetSwiftCodeDetailsQuery,
  ): Promise<SwiftCodeDetailsDto | SwiftCodeWithBranchesDto | null> {
    const { swiftCode } = query;
    const swiftCodeData =
      await this.swiftCodeRepository.findSwiftCodeWithBankAndCountry(swiftCode);
    if (!swiftCodeData) {
      return null;
    }
    if (swiftCodeData.isHeadquarter) {
      const branches =
        await this.swiftCodeRepository.findBranchesByHeadquarter(swiftCode);
      return {
        address: swiftCodeData.address,
        bankName: swiftCodeData.bankName,
        countryISO2: swiftCodeData.countryISO2,
        countryName: swiftCodeData.countryName,
        isHeadquarter: true,
        swiftCode: swiftCodeData.swiftCode,
        branches: branches.map((b) => ({
          address: b.address,
          bankName: b.bankName,
          countryISO2: b.countryISO2,
          isHeadquarter: b.isHeadquarter,
          swiftCode: b.swiftCode,
          countryName: b.countryName,
        })),
      };
    }
    return {
      address: swiftCodeData.address,
      bankName: swiftCodeData.bankName,
      countryISO2: swiftCodeData.countryISO2,
      countryName: swiftCodeData.countryName,
      isHeadquarter: false,
      swiftCode: swiftCodeData.swiftCode,
    };
  }
}
