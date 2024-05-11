import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImgurlAndDescriptionOnModule1715451483897 implements MigrationInterface {
    name = 'AddImgurlAndDescriptionOnModule1715451483897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "module" ADD "imgUrl" character varying DEFAULT 'https://placehold.co/600x400'`);
        await queryRunner.query(`ALTER TABLE "module" ADD "description" character varying DEFAULT 'Absolutely amazing module'`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "imgUrl" character varying DEFAULT 'https://placehold.co/600x400'`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "description" character varying DEFAULT 'Absolutely amazing module'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "imgUrl"`);
        await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "imgUrl"`);
    }

}
