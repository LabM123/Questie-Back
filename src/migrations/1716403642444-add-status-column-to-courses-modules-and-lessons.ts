import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusColumnToCoursesModulesAndLessons1716403642444 implements MigrationInterface {
    name = 'AddStatusColumnToCoursesModulesAndLessons1716403642444'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."lesson_status_enum" AS ENUM('pending', 'complete')`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD "status" "public"."lesson_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`CREATE TYPE "public"."module_status_enum" AS ENUM('pending', 'complete')`);
        await queryRunner.query(`ALTER TABLE "module" ADD "status" "public"."module_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`CREATE TYPE "public"."courses_status_enum" AS ENUM('pending', 'complete')`);
        await queryRunner.query(`ALTER TABLE "courses" ADD "status" "public"."courses_status_enum" NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."courses_status_enum"`);
        await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."module_status_enum"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."lesson_status_enum"`);
    }

}
