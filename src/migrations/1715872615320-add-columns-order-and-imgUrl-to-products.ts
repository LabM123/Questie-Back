import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnsOrderAndImgUrlToProducts1715872615320 implements MigrationInterface {
    name = 'AddColumnsOrderAndImgUrlToProducts1715872615320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "imgUrl" character varying NOT NULL DEFAULT 'https://placehold.co/600x400.png'`);
        await queryRunner.query(`ALTER TABLE "products" ADD "order" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "order"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "imgUrl"`);
    }

}
