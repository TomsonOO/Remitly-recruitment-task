import { CreateSwiftCodeDto } from '../DTO/CreateSwiftCodeDto';

export class CreateSwiftCodeCommand {
  public readonly swiftCode: string;
  public readonly isHeadquarter: boolean;
  public readonly bankName: string;
  public readonly address: string;
  public readonly townName: string;
  public readonly countryISO2: string;
  public readonly countryName: string;

  constructor(dto: CreateSwiftCodeDto) {
    this.swiftCode = dto.swiftCode;
    this.isHeadquarter = dto.isHeadquarter;
    this.bankName = dto.bankName;
    this.address = dto.address;
    this.townName = dto.townName;
    this.countryISO2 = dto.countryISO2;
    this.countryName = dto.countryName;
  }
}
