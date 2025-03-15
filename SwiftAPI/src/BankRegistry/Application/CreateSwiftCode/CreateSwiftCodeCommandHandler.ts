import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateSwiftCodeCommand } from './CreateSwiftCodeCommand';
import { SwiftCodeRepositoryPort } from '../Port/SwiftCodeRepositoryPort';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateSwiftCodeCommand)
export class CreateSwiftCodeCommandHandler
  implements ICommandHandler<CreateSwiftCodeCommand>
{
  constructor(
    @Inject('SwiftCodeRepositoryPort')
    private readonly swiftCodeRepository: SwiftCodeRepositoryPort,
  ) {}

  async execute(command: CreateSwiftCodeCommand): Promise<void> {
    const {
      swiftCode,
      isHeadquarter,
      bankName,
      address,
      townName,
      countryISO2,
      countryName,
    } = command;

    await this.swiftCodeRepository.createSwiftCode({
      swiftCode,
      isHeadquarter,
      bankName,
      address,
      townName,
      countryISO2,
      countryName,
    });
  }
}
