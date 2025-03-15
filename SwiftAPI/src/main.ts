import { NestFactory } from '@nestjs/core';
import { BankRegistryModule } from './BankRegistry/bankRegistry.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(BankRegistryModule);
    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    console.error('Error during application bootstrap', error);
    throw error;
  }
}
bootstrap();
