import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1715790506681 implements MigrationInterface {
    name = 'Initial1715790506681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "description" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "currency" character varying NOT NULL, "polymorphicEntityType" character varying, "polymorphicEntityId" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "slug" character varying NOT NULL DEFAULT 'programacion', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "headline" character varying NOT NULL, "description" character varying NOT NULL, "image" character varying NOT NULL, "bg_image" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_a3bb2d01cfa0f95bc5e034e1b7a" UNIQUE ("slug"), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "content" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "content" json NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "lesson_id" uuid, CONSTRAINT "PK_6a2083913f3647b44f205204e36" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lesson" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "order" integer NOT NULL, "xp" integer NOT NULL DEFAULT '0', "coins" integer NOT NULL DEFAULT '0', "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "module_id" uuid, CONSTRAINT "UQ_db1819e1834a90ab442530d7c2c" UNIQUE ("slug"), CONSTRAINT "PK_0ef25918f0237e68696dee455bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "module" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "image" character varying DEFAULT 'https://placehold.co/600x400', "description" character varying DEFAULT 'Absolutely amazing module', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "course_id" uuid, CONSTRAINT "PK_0e20d657f968b051e674fbe3117" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "enrolment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "userId" uuid, "courseId" uuid, CONSTRAINT "PK_5d2679f6c891d77c58aa0e05f2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coins" integer NOT NULL DEFAULT '0', "xp" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_c76e93dfef28ba9b6942f578ab1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "profile_pic" character varying NOT NULL DEFAULT 'https://placehold.co/200x200', "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "birthdate" TIMESTAMP NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "stats_id" uuid, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_f4ca2c1e7c96ae6e8a7cca9df80" UNIQUE ("username", "email"), CONSTRAINT "REL_f55fb5b508e96b05303efae93e" UNIQUE ("stats_id"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "total" numeric(10,2) NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "product_id" uuid, CONSTRAINT "REL_d79d227662ea59bababb37f255" UNIQUE ("product_id"), CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_course" ("coursesId" uuid NOT NULL, "categoriesId" uuid NOT NULL, CONSTRAINT "PK_5105f02e5c2def92446310055d5" PRIMARY KEY ("coursesId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_12f29c02e42dc0c2bc453206ce" ON "category_course" ("coursesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_20a3036fed822fff193940f289" ON "category_course" ("categoriesId") `);
        await queryRunner.query(`CREATE TABLE "progress" ("userId" uuid NOT NULL, "lessonId" uuid NOT NULL, CONSTRAINT "PK_26319ff74c8120c7b08842013f7" PRIMARY KEY ("userId", "lessonId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0366c96237f98ea1c8ba6e1ec3" ON "progress" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_df6c728a3df388df34e03d0808" ON "progress" ("lessonId") `);
        await queryRunner.query(`ALTER TABLE "content" ADD CONSTRAINT "FK_a2b70b7b1d78329f1b697ebef19" FOREIGN KEY ("lesson_id") REFERENCES "lesson"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson" ADD CONSTRAINT "FK_53d2329d64a9274517d7160c29c" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "module" ADD CONSTRAINT "FK_915ad25970ccbfeb9e16e82c181" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrolment" ADD CONSTRAINT "FK_23a5e90b5adf89dfdfe4218b982" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrolment" ADD CONSTRAINT "FK_32654bfec59f2a78ee4c2d6c9f1" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f55fb5b508e96b05303efae93e5" FOREIGN KEY ("stats_id") REFERENCES "stats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_d79d227662ea59bababb37f2553" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_c14b00795593eafc9d423e7f74d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_course" ADD CONSTRAINT "FK_12f29c02e42dc0c2bc453206cee" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_course" ADD CONSTRAINT "FK_20a3036fed822fff193940f289c" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_df6c728a3df388df34e03d08088" FOREIGN KEY ("lessonId") REFERENCES "lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_df6c728a3df388df34e03d08088"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35"`);
        await queryRunner.query(`ALTER TABLE "category_course" DROP CONSTRAINT "FK_20a3036fed822fff193940f289c"`);
        await queryRunner.query(`ALTER TABLE "category_course" DROP CONSTRAINT "FK_12f29c02e42dc0c2bc453206cee"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_c14b00795593eafc9d423e7f74d"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_d79d227662ea59bababb37f2553"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f55fb5b508e96b05303efae93e5"`);
        await queryRunner.query(`ALTER TABLE "enrolment" DROP CONSTRAINT "FK_32654bfec59f2a78ee4c2d6c9f1"`);
        await queryRunner.query(`ALTER TABLE "enrolment" DROP CONSTRAINT "FK_23a5e90b5adf89dfdfe4218b982"`);
        await queryRunner.query(`ALTER TABLE "module" DROP CONSTRAINT "FK_915ad25970ccbfeb9e16e82c181"`);
        await queryRunner.query(`ALTER TABLE "lesson" DROP CONSTRAINT "FK_53d2329d64a9274517d7160c29c"`);
        await queryRunner.query(`ALTER TABLE "content" DROP CONSTRAINT "FK_a2b70b7b1d78329f1b697ebef19"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df6c728a3df388df34e03d0808"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0366c96237f98ea1c8ba6e1ec3"`);
        await queryRunner.query(`DROP TABLE "progress"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20a3036fed822fff193940f289"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12f29c02e42dc0c2bc453206ce"`);
        await queryRunner.query(`DROP TABLE "category_course"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "stats"`);
        await queryRunner.query(`DROP TABLE "enrolment"`);
        await queryRunner.query(`DROP TABLE "module"`);
        await queryRunner.query(`DROP TABLE "lesson"`);
        await queryRunner.query(`DROP TABLE "content"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
