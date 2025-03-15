import { DeleteSwiftCodeCommandHandler } from 'src/BankRegistry/Application/DeleteSwiftCode/DeleteSwiftCodeCommandHandler';
import { DeleteSwiftCodeCommand } from 'src/BankRegistry/Application/DeleteSwiftCode/DeleteSwiftCodeCommand';
import { SwiftCodeRepositoryPort } from 'src/BankRegistry/Application/Port/SwiftCodeRepositoryPort';
import { NotFoundException } from '@nestjs/common';

describe('DeleteSwiftCodeCommandHandler', () => {
  let handler: DeleteSwiftCodeCommandHandler;
  let mockRepository: jest.Mocked<SwiftCodeRepositoryPort>;

  beforeEach(() => {
    mockRepository = {
      deleteSwiftCode: jest.fn(),
    } as any;

    handler = new DeleteSwiftCodeCommandHandler(mockRepository);
  });

  it('should delete swift code when it exists', async () => {
    mockRepository.deleteSwiftCode.mockResolvedValue(true);

    await expect(
      handler.execute(new DeleteSwiftCodeCommand('TEST123')),
    ).resolves.not.toThrow();

    expect(mockRepository.deleteSwiftCode).toHaveBeenCalledWith('TEST123');
  });

  it('should throw NotFoundException when swift code does not exist', async () => {
    mockRepository.deleteSwiftCode.mockResolvedValue(false);

    await expect(
      handler.execute(new DeleteSwiftCodeCommand('INVALID')),
    ).rejects.toThrow(NotFoundException);

    expect(mockRepository.deleteSwiftCode).toHaveBeenCalledWith('INVALID');
  });

  it('should throw error when repository fails', async () => {
    const error = new Error('Database connection failed');
    mockRepository.deleteSwiftCode.mockRejectedValue(error);

    await expect(
      handler.execute(new DeleteSwiftCodeCommand('TEST123')),
    ).rejects.toThrow('Database connection failed');

    expect(mockRepository.deleteSwiftCode).toHaveBeenCalledWith('TEST123');
  });
}); 