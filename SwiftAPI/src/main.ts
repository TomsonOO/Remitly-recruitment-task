import { NestFactory } from '@nestjs/core';
import { BankRegistryModule } from './BankRegistry/bankRegistry.module';

async function bootstrap() {
  const app = await NestFactory.create(BankRegistryModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
