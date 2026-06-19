import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateFeatures1705020232724 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'features',
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
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('features', 'FK_features_sub_features');
    await queryRunner.dropTable('features');
  }
}
