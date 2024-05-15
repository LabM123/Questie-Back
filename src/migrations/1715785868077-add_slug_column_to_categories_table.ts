import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlugColumnToCategoriesTable1715785868077 implements MigrationInterface {
    name = 'AddSlugColumnToCategoriesTable1715785868077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "slug" character varying NOT NULL DEFAULT 'programacion'`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "slug"`);
    }

}
