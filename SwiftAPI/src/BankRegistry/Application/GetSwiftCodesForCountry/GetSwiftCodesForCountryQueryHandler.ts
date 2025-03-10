import { GetSwiftCodesForCountryQuery } from "./GetSwiftCodesForCountryQuery";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { SwiftCodeRepositoryPort } from "../Port/SwiftCodeRepositoryPort";
import { Inject } from "@nestjs/common";
import { CountrySwiftCodesDto } from "../DTO/CountrySwiftCodesDto";

@QueryHandler(GetSwiftCodesForCountryQuery)
export class GetSwiftCodesForCountryQueryHandler
    implements IQueryHandler<GetSwiftCodesForCountryQuery>
{
    constructor(
        @Inject('SwiftCodeRepositoryPort')
        private readonly swiftCodeRepository: SwiftCodeRepositoryPort
    ) {}

    async execute(
        query: GetSwiftCodesForCountryQuery,
    ): Promise<CountrySwiftCodesDto | null> {
        const result = await this.swiftCodeRepository.findByCountry(query.countryISO2);
        
        if (!result) {
            return null;
        }

        return result;
    }
}