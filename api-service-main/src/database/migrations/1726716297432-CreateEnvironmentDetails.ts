import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEnvironmentDetails1726716297432
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the environment_details table
    await queryRunner.createTable(
      new Table({
        name: 'environment_details',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'wind_speed',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'light_intensity',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'temperature',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'humidity',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'trap_node_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'collection_time',
            type: 'timestamptz',
            isNullable: false,
          },
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
    );

    // Create foreign key relationship with trap_nodes table
    await queryRunner.createForeignKey(
      'environment_details',
      new TableForeignKey({
        columnNames: ['trap_node_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'trap_nodes',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    const table = await queryRunner.getTable('environment_details');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('trap_node_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('environment_details', foreignKey);
    }

    // Drop the environment_details table
    await queryRunner.dropTable('environment_details');
  }
}
