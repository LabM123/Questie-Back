import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnIsProductToCourse1716910714197 implements MigrationInterface {
    name = 'AddColumnIsProductToCourse1716910714197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD "isProduct" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "isProduct"`);
    }

}
