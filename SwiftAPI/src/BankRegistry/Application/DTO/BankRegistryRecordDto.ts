export class BankRegistryRecordDTO {
    address: string;
    bankName: string;
    countryISO2: string;
    countryName: string;
    isHeadquarter: boolean;
    swiftCode: string;
}

export class BankRegistryRecordWithBranchesDTO extends BankRegistryRecordDTO {
    branches: BankRegistryRecordDTO[];
}
