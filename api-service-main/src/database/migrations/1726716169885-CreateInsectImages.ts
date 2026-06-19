import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateInsectImages1726716169885 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'insect_images',
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
            isNullable: false,
          },
          {
            name: 'insect_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'tag',
            type: 'varchar',
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

    // Create foreign key relationship with insects table
    await queryRunner.createForeignKey(
      'insect_images',
      new TableForeignKey({
        columnNames: ['insect_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'insects',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key first
    const table = await queryRunner.getTable('insect_images');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('insect_id') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('insect_images', foreignKey);
    }

    // Drop the insect_images table
    await queryRunner.dropTable('insect_images');
  }
}
