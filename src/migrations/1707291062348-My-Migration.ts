import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1707291062348 implements MigrationInterface {
    name = 'MyMigration1707291062348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "thread" ("id" SERIAL NOT NULL, "content" character varying(160) NOT NULL, "image" character varying, "likes" integer NOT NULL DEFAULT '0', "replies" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "userId" integer, CONSTRAINT "PK_cabc0f3f27d7b1c70cf64623e02" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "picture" character varying, "cover_photo" character varying, "bio" character varying, "followerId" integer, "followingId" integer, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reply" ("id" SERIAL NOT NULL, "content" character varying(160) NOT NULL, "image" character varying, "likes" integer NOT NULL DEFAULT '0', "replies" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT NOW(), "userId" integer, CONSTRAINT "PK_94fa9017051b40a71e000a2aff9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "like" ("id" SERIAL NOT NULL, "threadIdId" integer, CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "thread" ADD CONSTRAINT "FK_57782d1d6ab602aa9ff43cf30a2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_fb3a87f3c6ccb321db8e7b7f07b" FOREIGN KEY ("followerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a8e170f2d7a5363524ddc1e92c1" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reply" ADD CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_86bfef1b98a64fb96f3181e680f" FOREIGN KEY ("threadIdId") REFERENCES "thread"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_86bfef1b98a64fb96f3181e680f"`);
        await queryRunner.query(`ALTER TABLE "reply" DROP CONSTRAINT "FK_e9886d6d04a19413a2f0aac5d7b"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a8e170f2d7a5363524ddc1e92c1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_fb3a87f3c6ccb321db8e7b7f07b"`);
        await queryRunner.query(`ALTER TABLE "thread" DROP CONSTRAINT "FK_57782d1d6ab602aa9ff43cf30a2"`);
        await queryRunner.query(`DROP TABLE "like"`);
        await queryRunner.query(`DROP TABLE "reply"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "thread"`);
    }

}
