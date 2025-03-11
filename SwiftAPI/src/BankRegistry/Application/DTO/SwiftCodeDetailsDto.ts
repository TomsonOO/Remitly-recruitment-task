export class SwiftCodeDetailsDto {
  address: string;
  bankName: string;
  countryISO2: string;
  countryName: string;
  isHeadquarter: boolean;
  swiftCode: string;
}

export class SwiftCodeWithBranchesDto extends SwiftCodeDetailsDto {
  branches: SwiftCodeDetailsDto[];
}
