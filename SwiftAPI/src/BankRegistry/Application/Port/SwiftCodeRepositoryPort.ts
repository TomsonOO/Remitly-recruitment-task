import { CountrySwiftCodesDto } from '../DTO/CountrySwiftCodesDto';
import { SwiftCodeWithBankCountry } from './types';

export interface SwiftCodeRepositoryPort {
  findSwiftCodeWithBankAndCountry(
    swiftCode: string,
  ): Promise<SwiftCodeWithBankCountry | null>;

  findBranchesByHeadquarter(
    swiftCodeHeadquarter: string,
  ): Promise<SwiftCodeWithBankCountry[]>;

  findByCountry(countryISO2: string): Promise<CountrySwiftCodesDto | null>;
}
