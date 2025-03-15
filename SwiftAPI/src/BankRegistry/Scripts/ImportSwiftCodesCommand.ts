import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { BankRegistryModule } from '../bankRegistry.module';
import { SwiftCodeExcelImporter } from '../Infrastructure/Import/SwiftCodeExcelImporter';

async function importSwiftCodes(): Promise<void> {
  const logger = new Logger('ImportSwiftCodesCommand');

  try {
    const filePath = process.argv[2];
    if (!filePath) {
      throw new Error(
        'File path argument is required. Usage: npm run import-swift-codes <file-path>',
      );
    }

    logger.log('Initializing application context...');
    const app = await NestFactory.createApplicationContext(BankRegistryModule);

    const importer = app.get(SwiftCodeExcelImporter);
    await importer.import(filePath);

    await app.close();
    logger.log('Import completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error(`Import failed: ${error.message}`);
    process.exit(1);
  }
}

importSwiftCodes();
