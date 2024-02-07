import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1707292558983 implements MigrationInterface {
    name = 'MyMigration1707292558983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
