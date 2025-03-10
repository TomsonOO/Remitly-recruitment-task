export class SwiftCodeForCountryDto {
    address: string;
    bankName: string;
    countryISO2: string;
    isHeadquarter: boolean;
    swiftCode: string;
}

export class CountrySwiftCodesDto {
    countryISO2: string;
    countryName: string;
    swiftCodes: SwiftCodeForCountryDto[];
}