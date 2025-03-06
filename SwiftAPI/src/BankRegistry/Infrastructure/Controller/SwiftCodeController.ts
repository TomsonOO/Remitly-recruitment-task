import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetSwiftCodeDetailsQuery } from '../../Application/GetSwiftCodeDetails/GetSwiftCodeDetailsQuery';
import { SwiftCodeDetailsDto } from '../../Application/DTO/SwiftCodeDetailsDto';
import { SwiftCodeWithBranchesDto } from '../../Application/DTO/SwiftCodeDetailsDto';

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
}
