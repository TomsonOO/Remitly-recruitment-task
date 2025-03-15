import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestDataSource } from 'src/database/test-data-source';
import { SwiftCodeEntity } from 'src/BankRegistry/Domain/swift-code.entity';
import { CountryEntity } from 'src/BankRegistry/Domain/country.entity';
import { BankEntity } from 'src/BankRegistry/Domain/bank.entity';
import { AddressEntity } from 'src/BankRegistry/Domain/address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestModule } from '../../test.module';

describe('Swift Code Details API', () => {
  let app: INestApplication;
  let testDataSource: typeof TestDataSource;
  let swiftCodeRepository: Repository<SwiftCodeEntity>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    testDataSource = TestDataSource;
    if (!testDataSource.isInitialized) {
      await testDataSource.initialize();
    }

    swiftCodeRepository = moduleRef.get(getRepositoryToken(SwiftCodeEntity));

    try {
      await testDataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    } catch (error) {
      console.error('Error creating uuid-ossp extension:', error);
    }

    await testDataSource.synchronize(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async () => {
    await testDataSource.transaction(async manager => {
      await manager.query('DELETE FROM swift_codes');
      await manager.query('DELETE FROM addresses');
      await manager.query('DELETE FROM banks');
      await manager.query('DELETE FROM countries');

      const polandCountry = manager.create(CountryEntity, {
        iso2Code: 'PL',
        name: 'POLAND'
      });
      await manager.save(polandCountry);

      const germanyCountry = manager.create(CountryEntity, {
        iso2Code: 'DE',
        name: 'GERMANY'
      });
      await manager.save(germanyCountry);

      const testBank = manager.create(BankEntity, {
        name: 'TEST BANK'
      });
      await manager.save(testBank);

      const hqAddress = manager.create(AddressEntity, {
        address: 'Main Street 123',
        townName: 'Warsaw',
        country: polandCountry
      });
      await manager.save(hqAddress);

      const branchAddress = manager.create(AddressEntity, {
        address: 'Berlin Street 456',
        townName: 'Berlin',
        country: germanyCountry
      });
      await manager.save(branchAddress);

      const hqSwiftCode = manager.create(SwiftCodeEntity, {
        swiftCode: 'TESTPLHQ',
        isHeadquarter: true,
        bank: testBank,
        address: hqAddress
      });
      await manager.save(hqSwiftCode);

      const branchSwiftCode = manager.create(SwiftCodeEntity, {
        swiftCode: 'TESTDEBR',
        isHeadquarter: false,
        bank: testBank,
        address: branchAddress
      });
      await manager.save(branchSwiftCode);
    });

    await new Promise(resolve => setTimeout(resolve, 500));
  });

  afterAll(async () => {
    await testDataSource.destroy();
    await app.close();
  });

  it('should return details for a headquarters swift code with branches', async () => {
   
    const response = await request(app.getHttpServer())
      .get('/v1/swift-codes/TESTPLHQ')
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.swiftCode).toBe('TESTPLHQ');
    expect(response.body.bankName).toBe('TEST BANK');
    expect(response.body.address).toBe('Main Street 123');
    expect(response.body.countryISO2).toBe('PL');
    expect(response.body.countryName).toBe('POLAND');
    expect(response.body.isHeadquarter).toBe(true);
    
    expect(response.body.branches).toBeInstanceOf(Array);
    expect(response.body.branches.length).toBe(1);
    expect(response.body.branches[0].swiftCode).toBe('TESTDEBR');
    expect(response.body.branches[0].bankName).toBe('TEST BANK');
    expect(response.body.branches[0].address).toBe('Berlin Street 456');
    expect(response.body.branches[0].countryISO2).toBe('DE');
    expect(response.body.branches[0].isHeadquarter).toBe(false);
  });

  it('should return all swift codes for a given country', async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await request(app.getHttpServer())
      .get('/v1/swift-codes/country/PL')
      .expect(200);

    const responseData = response.body.swiftCodes;
    expect(responseData).toBeDefined();
    expect(Array.isArray(responseData)).toBe(true);
    expect(responseData.length).toBe(1);
    expect(responseData[0].swiftCode).toBe('TESTPLHQ');
    expect(responseData[0].bankName).toBe('TEST BANK');
    expect(responseData[0].address).toBe('Main Street 123');
    expect(responseData[0].countryISO2).toBe('PL');
    expect(responseData[0].isHeadquarter).toBe(true);
  });

  it('should return empty array for a country with no swift codes', async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response = await request(app.getHttpServer())
      .get('/v1/swift-codes/country/FR')
      .expect(404);

    expect(response.body).toBeDefined();
    expect(response.body.message).toBeDefined();
  });

});