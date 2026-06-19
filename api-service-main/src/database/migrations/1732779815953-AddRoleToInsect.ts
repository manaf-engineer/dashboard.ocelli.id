import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddRoleToInsect1732779815953 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'insects',
      new TableColumn({
        name: 'role',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('insects', 'role');
  }
}
