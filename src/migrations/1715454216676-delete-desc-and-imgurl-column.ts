import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteDescAndImgurlColumn1715454216676 implements MigrationInterface {
    name = 'DeleteDescAndImgurlColumn1715454216676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "imgUrl"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" ADD "description" character varying DEFAULT 'Absolutely amazing module'`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "imgUrl" character varying DEFAULT 'https://placehold.co/600x400'`);
    }

}
