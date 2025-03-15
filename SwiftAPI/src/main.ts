import { NestFactory } from '@nestjs/core';
import { BankRegistryModule } from './BankRegistry/bankRegistry.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(BankRegistryModule);
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }));
    await app.listen(process.env.PORT ?? 3000);
  } catch (error) {
    console.error('Error during application bootstrap', error);
    throw error;
  }
}
bootstrap();
