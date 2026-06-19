import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreatePolicies1705020253897 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'policies',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'status', type: 'boolean', default: false },
          { name: 'created_by', type: 'int', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'updated_by', type: 'int', isNullable: true },
          { name: 'updated_at', type: 'timestamptz', isNullable: true },
          { name: 'features_id', type: 'int' },
          { name: 'sub_features_id', type: 'int' },
          { name: 'role_id', type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'policies',
      new TableForeignKey({
        columnNames: ['features_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'features',
        onDelete: 'SET NULL', // Adjust the onDelete behavior according to your needs
      }),
    );

    await queryRunner.createForeignKey(
      'policies',
      new TableForeignKey({
        columnNames: ['sub_features_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sub_features',
        onDelete: 'SET NULL', // Adjust the onDelete behavior according to your needs
      }),
    );

    await queryRunner.createForeignKey(
      'policies',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'roles',
        onDelete: 'SET NULL', // Adjust the onDelete behavior according to your needs
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('policies', 'FK_policies_features');
    await queryRunner.dropForeignKey('policies', 'FK_policies_sub_features');
    await queryRunner.dropForeignKey('policies', 'FK_policies_roles');
    await queryRunner.dropTable('policies');
  }
}
