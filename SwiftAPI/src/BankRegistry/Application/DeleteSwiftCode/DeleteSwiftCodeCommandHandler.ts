import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSwiftCodeCommand } from './DeleteSwiftCodeCommand';
import { SwiftCodeRepositoryPort } from '../Port/SwiftCodeRepositoryPort';
import { Inject, NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteSwiftCodeCommand)
export class DeleteSwiftCodeCommandHandler
  implements ICommandHandler<DeleteSwiftCodeCommand>
{
  constructor(
    @Inject('SwiftCodeRepositoryPort')
    private readonly swiftCodeRepository: SwiftCodeRepositoryPort,
  ) {}

  async execute(command: DeleteSwiftCodeCommand): Promise<void> {
    const { swiftCode } = command;

    const deleted = await this.swiftCodeRepository.deleteSwiftCode(swiftCode);
    
    if (!deleted) {
      throw new NotFoundException(`SWIFT code not found: ${swiftCode}`);
    }
  }
}
