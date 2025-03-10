import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetSwiftCodeDetailsQuery } from '../../Application/GetSwiftCodeDetails/GetSwiftCodeDetailsQuery';
import { SwiftCodeDetailsDto, SwiftCodeWithBranchesDto } from '../../Application/DTO/SwiftCodeDetailsDto';
import { GetSwiftCodesForCountryQuery } from "../../Application/GetSwiftCodesForCountry/GetSwiftCodesForCountryQuery";
import { CountrySwiftCodesDto } from "../../Application/DTO/CountrySwiftCodesDto";

@Controller('v1/swift-codes')
export class SwiftCodeController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get(':swiftCode')
    async getSwiftCode(@Param('swiftCode') swiftCode: string) {
        const result = await this.queryBus.execute<
            GetSwiftCodeDetailsQuery,
            SwiftCodeDetailsDto | SwiftCodeWithBranchesDto | null
        >(new GetSwiftCodeDetailsQuery(swiftCode));

        if (!result) {
            throw new NotFoundException(`SWIFT code not found: ${swiftCode}`);
        }
        return result;
    }

    @Get('country/:countryISO2code')
    async getCountrySwiftCodes(
        @Param('countryISO2code') countryISO2code: string
    ): Promise<CountrySwiftCodesDto> {
        const result = await this.queryBus.execute<
            GetSwiftCodesForCountryQuery,
            CountrySwiftCodesDto | null
        >(new GetSwiftCodesForCountryQuery(countryISO2code));

        if (!result) {
            throw new NotFoundException(`Country codes not found: ${countryISO2code}`);
        }
        return result;
    }
}