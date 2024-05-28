import { MigrationInterface, QueryRunner } from "typeorm";

export class ProgressEntity1716867679580 implements MigrationInterface {
    name = 'ProgressEntity1716867679580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_df6c728a3df388df34e03d08088"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0366c96237f98ea1c8ba6e1ec3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df6c728a3df388df34e03d0808"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "PK_26319ff74c8120c7b08842013f7"`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "PK_df6c728a3df388df34e03d08088" PRIMARY KEY ("lessonId")`);
        await queryRunner.query(`ALTER TABLE "progress" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "PK_df6c728a3df388df34e03d08088"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP COLUMN "lessonId"`);
        await queryRunner.query(`ALTER TABLE "progress" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "PK_79abdfd87a688f9de756a162b6f" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "progress" ADD "completed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "progress" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "progress" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "progress" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "progress" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "progress" ADD "lesson_id" uuid`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_ddcaca3a9db9d77105d51c02c24" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_ef62be61a6c4f69d0570bb5cc35" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_ef62be61a6c4f69d0570bb5cc35"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_ddcaca3a9db9d77105d51c02c24"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP COLUMN "lesson_id"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP COLUMN "completed"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "PK_79abdfd87a688f9de756a162b6f"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "progress" ADD "lessonId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "PK_df6c728a3df388df34e03d08088" PRIMARY KEY ("lessonId")`);
        await queryRunner.query(`ALTER TABLE "progress" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "PK_df6c728a3df388df34e03d08088"`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "PK_26319ff74c8120c7b08842013f7" PRIMARY KEY ("userId", "lessonId")`);
        await queryRunner.query(`CREATE INDEX "IDX_df6c728a3df388df34e03d0808" ON "progress" ("lessonId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0366c96237f98ea1c8ba6e1ec3" ON "progress" ("userId") `);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_df6c728a3df388df34e03d08088" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
