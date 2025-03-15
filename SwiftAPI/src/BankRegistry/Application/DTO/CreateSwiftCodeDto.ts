import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSwiftCodeDto {
  @IsNotEmpty()
  @IsString()
  swiftCode: string;

  @IsBoolean()
  isHeadquarter: boolean;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  bankName: string;

  @IsString()
  @Transform(({ value }) => value?.trim() || '')
  address: string;

  @IsString()
  @Transform(({ value }) => value?.trim() || '')
  townName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  @Transform(({ value }) => value.trim())
  countryISO2: string;

  @IsString()
  @Transform(({ value }) => value?.trim() || '')
  countryName: string;
}
