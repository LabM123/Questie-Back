import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageColumnToCategory1715967277279 implements MigrationInterface {
    name = 'AddImageColumnToCategory1715967277279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "image" character varying NOT NULL DEFAULT 'https://placehold.co/600x400.png'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "image"`);
    }

}
