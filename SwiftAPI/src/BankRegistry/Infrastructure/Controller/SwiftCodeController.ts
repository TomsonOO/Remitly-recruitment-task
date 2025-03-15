import { Controller, Get, Param, NotFoundException, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe, Delete } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { GetSwiftCodeDetailsQuery } from '../../Application/GetSwiftCodeDetails/GetSwiftCodeDetailsQuery';
import { SwiftCodeDetailsDto, SwiftCodeWithBranchesDto } from '../../Application/DTO/SwiftCodeDetailsDto';
import { GetSwiftCodesForCountryQuery } from '../../Application/GetSwiftCodesForCountry/GetSwiftCodesForCountryQuery';
import { CountrySwiftCodesDto } from '../../Application/DTO/CountrySwiftCodesDto';
import { CreateSwiftCodeCommand } from '../../Application/CreateSwiftCode/CreateSwiftCodeCommand';
import { CreateSwiftCodeDto } from '../../Application/DTO/CreateSwiftCodeDto';
import { DeleteSwiftCodeCommand } from '../../Application/DeleteSwiftCode/DeleteSwiftCodeCommand';

@Controller('v1/swift-codes')
export class SwiftCodeController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get(':swiftCode')
  async getSwiftCode(@Param('swiftCode') swiftCode: string) {
    const result = await this.queryBus.execute<GetSwiftCodeDetailsQuery, SwiftCodeDetailsDto | SwiftCodeWithBranchesDto | null>(
      new GetSwiftCodeDetailsQuery(swiftCode)
    );

    if (!result) {
      throw new NotFoundException(`SWIFT code not found: ${swiftCode}`);
    }
    return result;
  }

  @Get('country/:countryISO2code')
  async getCountrySwiftCodes(@Param('countryISO2code') countryISO2code: string): Promise<CountrySwiftCodesDto> {
    const result = await this.queryBus.execute<GetSwiftCodesForCountryQuery, CountrySwiftCodesDto | null>(
      new GetSwiftCodesForCountryQuery(countryISO2code)
    );

    if (!result) {
      throw new NotFoundException(`Country codes not found: ${countryISO2code}`);
    }
    return result;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createSwiftCode(@Body() dto: CreateSwiftCodeDto) {
    const command = new CreateSwiftCodeCommand(dto);
    
    await this.commandBus.execute(command);
    return { message: 'Swift Code created successfully' };
  }

  @Delete(':swiftCode')
  @HttpCode(HttpStatus.OK)
  async deleteSwiftCode(@Param('swiftCode') swiftCode: string) {
    const command = new DeleteSwiftCodeCommand(swiftCode);
    
    await this.commandBus.execute(command);
    return { message: 'Swift Code deleted successfully' };
  }
}
