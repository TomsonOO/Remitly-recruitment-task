import { PostgresSwiftCodeRepository } from 'src/BankRegistry/Infrastructure/Persistence/PostgresSwiftCodeRepository';
import { Repository } from 'typeorm';
import { SwiftCodeEntity } from 'src/BankRegistry/Domain/swift-code.entity';

describe('PostgresSwiftCodeRepository', () => {
  let repository: PostgresSwiftCodeRepository;
  let mockTypeOrmRepository: jest.Mocked<Repository<SwiftCodeEntity>>;

  beforeEach(() => {
    mockTypeOrmRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
    } as any;

    repository = new PostgresSwiftCodeRepository(mockTypeOrmRepository);
  });

  describe('findSwiftCodeWithBankAndCountry', () => {
    it('should return null when swift code not found', async () => {
      mockTypeOrmRepository.findOne.mockResolvedValue(null);

      const result =
        await repository.findSwiftCodeWithBankAndCountry('INVALID');

      expect(result).toBeNull();
    });

    it('should return mapped data when swift code found', async () => {
      const mockEntity = {
        swiftCode: 'TEST123',
        isHeadquarter: true,
        bank: { name: 'Test Bank' },
        address: {
          address: 'Test Address',
          country: {
            iso2Code: 'PL',
            name: 'POLAND',
          },
        },
      };
      mockTypeOrmRepository.findOne.mockResolvedValue(mockEntity as any);

      const result =
        await repository.findSwiftCodeWithBankAndCountry('TEST123');

      expect(result).toEqual({
        swiftCode: 'TEST123',
        isHeadquarter: true,
        bankName: 'Test Bank',
        address: 'Test Address',
        countryISO2: 'PL',
        countryName: 'POLAND',
      });
    });
  });
});
