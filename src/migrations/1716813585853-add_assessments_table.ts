import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAssessmentsTable1716813585853 implements MigrationInterface {
    name = 'AddAssessmentsTable1716813585853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assessment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "score" integer NOT NULL DEFAULT '1', "userId" uuid, "courseId" uuid, CONSTRAINT "UQ_9191b2d99bd387c0b8fc723cb25" UNIQUE ("userId", "courseId"), CONSTRAINT "PK_c511a7dc128256876b6b1719401" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "assessment" ADD CONSTRAINT "FK_38ce7d1e5d9ab4261af36e3bf3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assessment" ADD CONSTRAINT "FK_bed7f069031b74d94db7e4ef43d" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assessment" DROP CONSTRAINT "FK_bed7f069031b74d94db7e4ef43d"`);
        await queryRunner.query(`ALTER TABLE "assessment" DROP CONSTRAINT "FK_38ce7d1e5d9ab4261af36e3bf3b"`);
        await queryRunner.query(`DROP TABLE "assessment"`);
    }

}
