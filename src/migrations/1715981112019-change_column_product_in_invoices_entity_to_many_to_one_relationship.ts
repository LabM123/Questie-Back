import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnProductInInvoicesEntityToManyToOneRelationship1715981112019 implements MigrationInterface {
    name = 'ChangeColumnProductInInvoicesEntityToManyToOneRelationship1715981112019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_d79d227662ea59bababb37f2553"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "REL_d79d227662ea59bababb37f255"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_d79d227662ea59bababb37f2553" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_d79d227662ea59bababb37f2553"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "REL_d79d227662ea59bababb37f255" UNIQUE ("product_id")`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_d79d227662ea59bababb37f2553" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
