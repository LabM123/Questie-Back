import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDataColumnToProductEntity1716568148987 implements MigrationInterface {
    name = 'AddDataColumnToProductEntity1716568148987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "data" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "data"`);
    }

}
