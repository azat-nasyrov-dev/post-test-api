import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationsBetweenPostsAndUsers1706396055832 implements MigrationInterface {
  name = 'AddRelationsBetweenPostsAndUsers1706396055832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "authorId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c5a322ad12a7bf95460c958e80e"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "authorId"`);
  }
}
