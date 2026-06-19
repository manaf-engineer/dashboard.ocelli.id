import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCaptureResults1726716403496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the capture_results table
    await queryRunner.createTable(
      new Table({
        name: 'capture_results',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'image',
            type: 'text',
            isNullable: true, // Adjust based on your needs
          },
          {
            name: 'collection_time',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            name: 'trap_node_id',
            type: 'integer',
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
      'capture_results',
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
    const table = await queryRunner.getTable('capture_results');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('trap_node_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('capture_results', foreignKey);
    }

    // Drop the capture_results table
    await queryRunner.dropTable('capture_results');
  }
}
