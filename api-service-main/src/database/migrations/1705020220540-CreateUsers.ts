import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUsers1705020220540 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          { name: 'name', type: 'varchar' },
          { name: 'username', type: 'varchar', isUnique: true },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'password_reset_token', type: 'varchar', isNullable: true },
          { name: 'password_reset_at', type: 'timestamptz', isNullable: true },
          { name: 'status', type: 'boolean', default: true },
          { name: 'created_by', type: 'integer', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'updated_by', type: 'integer', isNullable: true },
          { name: 'updated_at', type: 'timestamptz', isNullable: true },
          { name: 'role_id', type: 'bigint', isNullable: true },
        ],
      }),
      true,
    );

    // Adding foreign key constraint for the 'roles' table
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'FK_users_roles');
    await queryRunner.dropTable('users');
  }
}
