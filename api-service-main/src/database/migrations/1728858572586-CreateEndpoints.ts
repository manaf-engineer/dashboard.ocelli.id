import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEndpoints1728858572586 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'endpoints',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'url', type: 'varchar' },
          { name: 'method', type: 'varchar' },
          { name: 'sub_features_id', type: 'int' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'endpoints', // Changed this from 'sub_features' to 'endpoints'
      new TableForeignKey({
        columnNames: ['sub_features_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sub_features',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Update the foreign key name based on the table and column names used
    const table = await queryRunner.getTable('endpoints');
    const foreignKey = table!.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('sub_features_id') !== -1,
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey('endpoints', foreignKey);
    }

    await queryRunner.dropTable('endpoints'); // Also drop the endpoints table here
  }
}
