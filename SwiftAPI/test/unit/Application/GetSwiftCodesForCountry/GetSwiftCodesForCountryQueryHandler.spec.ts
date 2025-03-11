import { CountrySwiftCodesDto } from "src/BankRegistry/Application/DTO/CountrySwiftCodesDto";
import { GetSwiftCodesForCountryQuery } from "src/BankRegistry/Application/GetSwiftCodesForCountry/GetSwiftCodesForCountryQuery";
import { GetSwiftCodesForCountryQueryHandler } from "src/BankRegistry/Application/GetSwiftCodesForCountry/GetSwiftCodesForCountryQueryHandler";
import { SwiftCodeRepositoryPort } from "src/BankRegistry/Application/Port/SwiftCodeRepositoryPort";


describe('GetSwiftCodesForCountryQueryHandler', () => { 
    let handler: GetSwiftCodesForCountryQueryHandler;
    let mockRepository: jest.Mocked<SwiftCodeRepositoryPort>;
    
    beforeEach(() => {
            mockRepository = {
            findByCountry: jest.fn(),
        } as any;

        handler = new GetSwiftCodesForCountryQueryHandler(mockRepository);
    });

    it('should return country swift codes when country exists', async () => {
        const mockCountryData: CountrySwiftCodesDto = {
            countryISO2: 'PL',
            countryName: 'POLAND',
            swiftCodes: [
                {
                    address: '123 ulica',
                    bankName: 'MOCK BANK',
                    countryISO2: 'PL',
                    isHeadquarter: true,
                    swiftCode: "MockkXXX"
                }
            ]
        };
        mockRepository.findByCountry.mockResolvedValue(mockCountryData);

        const result = await handler.execute(new GetSwiftCodesForCountryQuery('PL'));


        expect(result).toEqual(mockCountryData);
        expect(mockRepository.findByCountry).toHaveBeenCalledWith('PL');
    });

    it('should return null when country does not exist', async () => {
        mockRepository.findByCountry.mockResolvedValue(null);

        const result = await handler.execute(new GetSwiftCodesForCountryQuery('YY'));

        expect(result).toBeNull();
        expect(mockRepository.findByCountry).toHaveBeenCalledWith('YY');
    });

    it('should throw error when repository fails', async () => {
        const error = new Error('Database connection failed');
        mockRepository.findByCountry.mockRejectedValue(error);

        await expect(handler.execute(new GetSwiftCodesForCountryQuery('PL')))
            .rejects
            .toThrow('Database connection failed');
        expect(mockRepository.findByCountry).toHaveBeenCalledWith('PL');
    });
});