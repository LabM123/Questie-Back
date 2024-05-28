import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDateColumnToAssessment1716845418984 implements MigrationInterface {
    name = 'AddDateColumnToAssessment1716845418984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assessment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assessment" DROP COLUMN "created_at"`);
    }

}
