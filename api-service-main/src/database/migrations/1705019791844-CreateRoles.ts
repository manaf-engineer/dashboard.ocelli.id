import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRoles1705019791844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'label', type: 'varchar', isUnique: true },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'created_by', type: 'integer', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'updated_by', type: 'integer', isNullable: true },
          { name: 'updated_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles');
  }
}
