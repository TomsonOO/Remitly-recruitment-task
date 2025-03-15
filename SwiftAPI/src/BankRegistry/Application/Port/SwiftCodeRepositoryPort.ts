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

  createSwiftCode(params: {
    swiftCode: string;
    isHeadquarter: boolean;
    bankName: string;
    address: string;
    townName: string;
    countryISO2: string;
    countryName: string;
  }): Promise<void>;

  deleteSwiftCode(swiftCode: string): Promise<boolean>;
}
