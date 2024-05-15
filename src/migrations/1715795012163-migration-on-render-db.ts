import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationOnRenderDb1715795012163 implements MigrationInterface {
    name = 'MigrationOnRenderDb1715795012163'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrolment" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "enrolment" DROP COLUMN "course_id"`);
        await queryRunner.query(`ALTER TABLE "enrolment" DROP COLUMN "progress_id"`);
        await queryRunner.query(`ALTER TABLE "stats" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "coins" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "UQ_db1819e1834a90ab442530d7c2c" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "module" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "module" ADD "image" character varying DEFAULT 'https://placehold.co/600x400'`);
        await queryRunner.query(`ALTER TABLE "module" ADD "description" character varying DEFAULT 'Absolutely amazing module'`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "UQ_a3bb2d01cfa0f95bc5e034e1b7a" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "headline" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "bg_image" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "birthdate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "content" DROP CONSTRAINT "FK_a2b70b7b1d78329f1b697ebef19"`);
        await queryRunner.query(`ALTER TABLE "content" ALTER COLUMN "lesson_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_53d2329d64a9274517d7160c29c"`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "module_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_d79d227662ea59bababb37f2553"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "total" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "product_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "content" ADD CONSTRAINT "FK_a2b70b7b1d78329f1b697ebef19" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_53d2329d64a9274517d7160c29c" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_d79d227662ea59bababb37f2553" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_d79d227662ea59bababb37f2553"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_53d2329d64a9274517d7160c29c"`);
        await queryRunner.query(`ALTER TABLE "content" DROP CONSTRAINT "FK_a2b70b7b1d78329f1b697ebef19"`);
        await queryRunner.query(`ALTER TABLE "invoice" ALTER COLUMN "product_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "total" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_d79d227662ea59bababb37f2553" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "module_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_53d2329d64a9274517d7160c29c" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "content" ALTER COLUMN "lesson_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "content" ADD CONSTRAINT "FK_a2b70b7b1d78329f1b697ebef19" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthdate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "bg_image"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "headline"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "UQ_a3bb2d01cfa0f95bc5e034e1b7a"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "UQ_db1819e1834a90ab442530d7c2c"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "coins"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "stats" ADD "user_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "enrolment" ADD "progress_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "enrolment" ADD "course_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "enrolment" ADD "user_id" character varying NOT NULL`);
    }

}
