import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateSubFeatures1705020244611 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sub_features',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'created_by', type: 'int', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'updated_by', type: 'int', isNullable: true },
          { name: 'updated_at', type: 'timestamptz', isNullable: true },
          { name: 'features_id', type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'sub_features',
      new TableForeignKey({
        columnNames: ['features_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'features',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'sub_features',
      'FK_sub_features_features',
    );
    await queryRunner.dropTable('sub_features');
  }
}
