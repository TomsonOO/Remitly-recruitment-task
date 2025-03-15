import { PostgresSwiftCodeRepository } from 'src/BankRegistry/Infrastructure/Persistence/PostgresSwiftCodeRepository';
import { Repository, DeleteResult } from 'typeorm';
import { SwiftCodeEntity } from 'src/BankRegistry/Domain/swift-code.entity';
import { BankEntity } from 'src/BankRegistry/Domain/bank.entity';
import { CountryEntity } from 'src/BankRegistry/Domain/country.entity';
import { AddressEntity } from 'src/BankRegistry/Domain/address.entity';

describe('PostgresSwiftCodeRepository', () => {
  let repository: PostgresSwiftCodeRepository;
  let mockSwiftCodeRepository: jest.Mocked<Repository<SwiftCodeEntity>>;
  let mockBankRepository: jest.Mocked<Repository<BankEntity>>;
  let mockCountryRepository: jest.Mocked<Repository<CountryEntity>>;
  let mockAddressRepository: jest.Mocked<Repository<AddressEntity>>;

  beforeEach(() => {
    mockSwiftCodeRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      createQueryBuilder: jest.fn(),
      remove: jest.fn(),
    } as any;

    mockBankRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    mockCountryRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as any;

    mockAddressRepository = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    repository = new PostgresSwiftCodeRepository(
      mockSwiftCodeRepository,
      mockBankRepository,
      mockCountryRepository,
      mockAddressRepository
    );
  });

  describe('findSwiftCodeWithBankAndCountry', () => {
    it('should return null when swift code not found', async () => {
      mockSwiftCodeRepository.findOne.mockResolvedValue(null);

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
      mockSwiftCodeRepository.findOne.mockResolvedValue(mockEntity as any);

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

  describe('deleteSwiftCode', () => {
    it('should return false when swift code not found', async () => {
      mockSwiftCodeRepository.findOne.mockResolvedValue(null);

      const result = await repository.deleteSwiftCode('INVALID');

      expect(result).toBe(false);
      expect(mockSwiftCodeRepository.findOne).toHaveBeenCalledWith({
        where: { swiftCode: 'INVALID' },
        relations: ['address'],
      });
      expect(mockSwiftCodeRepository.remove).not.toHaveBeenCalled();
    });

    it('should delete swift code and return true when found', async () => {
      const mockSwiftCode = {
        id: '1',
        swiftCode: 'TEST123',
        address: { id: 'addr1' },
      };
      mockSwiftCodeRepository.findOne.mockResolvedValue(mockSwiftCode as any);
      mockSwiftCodeRepository.remove.mockResolvedValue(mockSwiftCode as SwiftCodeEntity);
      
      // No other swift codes using the same address
      mockSwiftCodeRepository.findOne.mockResolvedValueOnce(mockSwiftCode as any)
        .mockResolvedValueOnce(null);
      
      const deleteResult: DeleteResult = { raw: [], affected: 1 };
      mockAddressRepository.delete.mockResolvedValue(deleteResult);

      const result = await repository.deleteSwiftCode('TEST123');

      expect(result).toBe(true);
      expect(mockSwiftCodeRepository.findOne).toHaveBeenCalledWith({
        where: { swiftCode: 'TEST123' },
        relations: ['address'],
      });
      expect(mockSwiftCodeRepository.remove).toHaveBeenCalledWith(mockSwiftCode);
      expect(mockAddressRepository.delete).toHaveBeenCalledWith('addr1');
    });

    it('should not delete address if it is used by other swift codes', async () => {
      const mockSwiftCode = {
        id: '1',
        swiftCode: 'TEST123',
        address: { id: 'addr1' },
      };
      const otherSwiftCode = {
        id: '2',
        swiftCode: 'TEST456',
        address: { id: 'addr1' },
      };
      
      mockSwiftCodeRepository.findOne.mockResolvedValueOnce(mockSwiftCode as any)
        .mockResolvedValueOnce(otherSwiftCode as any);
      
      mockSwiftCodeRepository.remove.mockResolvedValue(mockSwiftCode as SwiftCodeEntity);

      const result = await repository.deleteSwiftCode('TEST123');

      expect(result).toBe(true);
      expect(mockSwiftCodeRepository.remove).toHaveBeenCalledWith(mockSwiftCode);
      expect(mockAddressRepository.delete).not.toHaveBeenCalled();
    });
  });
});
