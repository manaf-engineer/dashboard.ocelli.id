import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateImageTagsTable1727233045036 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Tags table
    await queryRunner.createTable(
      new Table({
        name: 'tags',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
        ],
      }),
    );

    // Create ImageTags table
    await queryRunner.createTable(
      new Table({
        name: 'image_tags',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
          },
          {
            name: 'image_id',
            type: 'int',
          },
          {
            name: 'tag_id',
            type: 'int',
          },
        ],
      }),
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'image_tags',
      new TableForeignKey({
        columnNames: ['image_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'insect_images',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'image_tags',
      new TableForeignKey({
        columnNames: ['tag_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'tags',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    const table = await queryRunner.getTable('image_tags');
    const foreignKey1 = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('image_id') !== -1,
    );
    const foreignKey2 = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('tag_id') !== -1,
    );

    if (foreignKey1) {
      await queryRunner.dropForeignKey('image_tags', foreignKey1);
    }
    if (foreignKey2) {
      await queryRunner.dropForeignKey('image_tags', foreignKey2);
    }

    // Drop ImageTags table
    await queryRunner.dropTable('image_tags');

    // Drop Tags table
    await queryRunner.dropTable('tags');
  }
}
