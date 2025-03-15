import { SwiftCodeController } from 'src/BankRegistry/Infrastructure/Controller/SwiftCodeController';
import { QueryBus } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

describe('SwiftCodeController', () => {
  let controller: SwiftCodeController;
  let mockQueryBus: jest.Mocked<QueryBus>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as any;
    controller = new SwiftCodeController(mockQueryBus);
  });

  describe('getSwiftCode', () => {
    it('should return swift code details when found', async () => {
      const mockResult = { swiftCode: 'TEST123', bankName: 'Test Bank' };
      mockQueryBus.execute.mockResolvedValue(mockResult);

      const result = await controller.getSwiftCode('TEST123');

      expect(result).toEqual(mockResult);
    });

    it('should throw NotFoundException when swift code not found', async () => {
      mockQueryBus.execute.mockResolvedValue(null);

      await expect(controller.getSwiftCode('INVALID')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getCountrySwiftCodes', () => {
    it('should return country swift codes when found', async () => {
      const mockResult = { countryISO2: 'PL', swiftCodes: [] };
      mockQueryBus.execute.mockResolvedValue(mockResult);

      const result = await controller.getCountrySwiftCodes('PL');

      expect(result).toEqual(mockResult);
    });

    it('should throw NotFoundException when country not found', async () => {
      mockQueryBus.execute.mockResolvedValue(null);

      await expect(controller.getCountrySwiftCodes('XX')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
