import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedBirthdateAndLastnameAndFirstnameColumn1715454814139 implements MigrationInterface {
    name = 'AddedBirthdateAndLastnameAndFirstnameColumn1715454814139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "enrolment" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "enrolment" DROP COLUMN "course_id"`);
        await queryRunner.query(`ALTER TABLE "enrolment" DROP COLUMN "progress_id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD "birthdate" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_53d2329d64a9274517d7160c29c"`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "module_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_53d2329d64a9274517d7160c29c" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_53d2329d64a9274517d7160c29c"`);
        await queryRunner.query(`ALTER TABLE "lesson" ALTER COLUMN "module_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_53d2329d64a9274517d7160c29c" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthdate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "enrolment" ADD "progress_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "enrolment" ADD "course_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "enrolment" ADD "user_id" character varying NOT NULL`);
    }

}
