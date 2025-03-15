import { SwiftCodeController } from 'src/BankRegistry/Infrastructure/Controller/SwiftCodeController';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';

describe('SwiftCodeController', () => {
  let controller: SwiftCodeController;
  let mockQueryBus: jest.Mocked<QueryBus>;
  let mockCommandBus: jest.Mocked<CommandBus>;

  beforeEach(() => {
    mockQueryBus = {
      execute: jest.fn(),
    } as any;
    
    mockCommandBus = {
      execute: jest.fn(),
    } as any;
    
    controller = new SwiftCodeController(mockQueryBus, mockCommandBus);
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
  
  describe('createSwiftCode', () => {
    it('should execute command and return success message', async () => {
      const dto = {
        swiftCode: 'TEST123',
        isHeadquarter: true,
        bankName: 'Test Bank',
        address: 'Test Address',
        townName: 'Test Town',
        countryISO2: 'PL',
        countryName: 'POLAND'
      };
      
      mockCommandBus.execute.mockResolvedValue(undefined);
      
      const result = await controller.createSwiftCode(dto);
      
      expect(result).toEqual({ message: 'Swift Code created successfully' });
      expect(mockCommandBus.execute).toHaveBeenCalled();
    });
  });
  
  describe('deleteSwiftCode', () => {
    it('should execute command and return success message', async () => {
      mockCommandBus.execute.mockResolvedValue(undefined);
      
      const result = await controller.deleteSwiftCode('TEST123');
      
      expect(result).toEqual({ message: 'Swift Code deleted successfully' });
      expect(mockCommandBus.execute).toHaveBeenCalled();
    });
  });
});
