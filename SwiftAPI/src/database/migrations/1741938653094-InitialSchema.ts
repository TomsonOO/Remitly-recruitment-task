import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1741938653094 implements MigrationInterface {
    name = 'InitialSchema1741938653094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "countries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "iso2Code" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_bd77f533f1ef52d9e960549e40e" UNIQUE ("iso2Code"), CONSTRAINT "UQ_fa1376321185575cf2226b1491d" UNIQUE ("name"), CONSTRAINT "PK_b2d7006793e8697ab3ae2deff18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "address" character varying NOT NULL, "townName" character varying NOT NULL, "countryId" uuid, CONSTRAINT "UQ_69b31ba33682e27f43b4754126a" UNIQUE ("address"), CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "swift_codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "swiftCode" character varying NOT NULL, "isHeadquarter" boolean NOT NULL, "bankId" uuid, "addressId" uuid, CONSTRAINT "UQ_df5957c917fa028aa102143a33c" UNIQUE ("swiftCode"), CONSTRAINT "PK_044ed5b60e53421f60c2969cb62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "banks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_bc680de8ba9d7878fddcecd610c" UNIQUE ("name"), CONSTRAINT "PK_3975b5f684ec241e3901db62d77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_589483c676701aa3bbb2695daf2" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "swift_codes" ADD CONSTRAINT "FK_bfaa19e9cfddba53eabf6d7c871" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "swift_codes" ADD CONSTRAINT "FK_3beb452fd5a4915478ce1d8b362" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swift_codes" DROP CONSTRAINT "FK_3beb452fd5a4915478ce1d8b362"`);
        await queryRunner.query(`ALTER TABLE "swift_codes" DROP CONSTRAINT "FK_bfaa19e9cfddba53eabf6d7c871"`);
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_589483c676701aa3bbb2695daf2"`);
        await queryRunner.query(`DROP TABLE "banks"`);
        await queryRunner.query(`DROP TABLE "swift_codes"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
        await queryRunner.query(`DROP TABLE "countries"`);
    }

}
