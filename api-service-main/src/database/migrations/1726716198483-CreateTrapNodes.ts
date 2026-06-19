import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTrapNodes1726716198483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the trap_nodes table
    await queryRunner.createTable(
      new Table({
        name: 'trap_nodes',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'trap_id',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'latitude',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'longitude',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'boolean',
            default: true,
          },
          {
            name: 'connection',
            type: 'boolean',
            default: false,
          },
          {
            name: 'area_id',
            type: 'integer',
            isNullable: true,
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

    // Create foreign key relationship with areas table
    await queryRunner.createForeignKey(
      'trap_nodes',
      new TableForeignKey({
        columnNames: ['area_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'areas',
        onDelete: 'SET NULL', // Adjust based on your needs
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    const table = await queryRunner.getTable('trap_nodes');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('area_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('trap_nodes', foreignKey);
    }

    // Drop the trap_nodes table
    await queryRunner.dropTable('trap_nodes');
  }
}
