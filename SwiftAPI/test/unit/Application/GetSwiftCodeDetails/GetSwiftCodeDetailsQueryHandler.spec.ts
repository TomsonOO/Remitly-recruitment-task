import { GetSwiftCodeDetailsQueryHandler } from 'src/BankRegistry/Application/GetSwiftCodeDetails/GetSwiftCodeDetailsQueryHandler';
import { GetSwiftCodeDetailsQuery } from 'src/BankRegistry/Application/GetSwiftCodeDetails/GetSwiftCodeDetailsQuery';
import { SwiftCodeRepositoryPort } from 'src/BankRegistry/Application/Port/SwiftCodeRepositoryPort';
import { SwiftCodeWithBankCountry } from 'src/BankRegistry/Application/Port/types';

describe('GetSwiftCodeDetailsQueryHandler', () => {
    let handler: GetSwiftCodeDetailsQueryHandler;
    let mockRepository: jest.Mocked<SwiftCodeRepositoryPort>;

    beforeEach(() => {
        mockRepository = {
            findSwiftCodeWithBankAndCountry: jest.fn(),
            findBranchesByHeadquarter: jest.fn(),
        } as any;

        handler = new GetSwiftCodeDetailsQueryHandler(mockRepository);
    });

    it('should return null when swift code does not exist', async () => {
        mockRepository.findSwiftCodeWithBankAndCountry.mockResolvedValue(null);

        const result = await handler.execute(new GetSwiftCodeDetailsQuery('INVALIDXXX'));

        expect(result).toBeNull();
        expect(mockRepository.findSwiftCodeWithBankAndCountry).toHaveBeenCalledWith('INVALIDXXX');
    });

    it('should return swift code details with branches when code is headquarters', async () => {
        const headquarterData: SwiftCodeWithBankCountry = {
            swiftCode: 'TESTXXXX',
            isHeadquarter: true,
            bankName: 'TEST BANK',
            address: 'TEST ADDRESS',
            countryISO2: 'PL',
            countryName: 'POLAND'
        };

        const branchData: SwiftCodeWithBankCountry[] = [{
            swiftCode: 'TEST1111',
            isHeadquarter: false,
            bankName: 'TEST BANK BRANCH',
            address: 'BRANCH ADDRESS',
            countryISO2: 'PL',
            countryName: 'POLAND'
        }];

        mockRepository.findSwiftCodeWithBankAndCountry.mockResolvedValue(headquarterData);
        mockRepository.findBranchesByHeadquarter.mockResolvedValue(branchData);

        const result = await handler.execute(new GetSwiftCodeDetailsQuery('TESTXXXX'));

        expect(result).toEqual({
            ...headquarterData,
            branches: branchData.map(b => ({
                address: b.address,
                bankName: b.bankName,
                countryISO2: b.countryISO2,
                isHeadquarter: b.isHeadquarter,
                swiftCode: b.swiftCode,
                countryName: b.countryName,
            }))
        });
        expect(mockRepository.findSwiftCodeWithBankAndCountry).toHaveBeenCalledWith('TESTXXXX');
        expect(mockRepository.findBranchesByHeadquarter).toHaveBeenCalledWith('TESTXXXX');
    });

    it('should return swift code details without branches when code is not headquarters', async () => {
        const branchData: SwiftCodeWithBankCountry = {
            swiftCode: 'TEST1111',
            isHeadquarter: false,
            bankName: 'TEST BANK BRANCH',
            address: 'BRANCH ADDRESS',
            countryISO2: 'PL',
            countryName: 'POLAND'
        };

        mockRepository.findSwiftCodeWithBankAndCountry.mockResolvedValue(branchData);

        const result = await handler.execute(new GetSwiftCodeDetailsQuery('TEST1111'));

        expect(result).toEqual({
            address: branchData.address,
            bankName: branchData.bankName,
            countryISO2: branchData.countryISO2,
            countryName: branchData.countryName,
            isHeadquarter: false,
            swiftCode: branchData.swiftCode,
        });
        expect(mockRepository.findSwiftCodeWithBankAndCountry).toHaveBeenCalledWith('TEST1111');
        expect(mockRepository.findBranchesByHeadquarter).not.toHaveBeenCalled();
    });
});