import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAreas1726716180322 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the areas table
    await queryRunner.createTable(
      new Table({
        name: 'areas',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'area_id',
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
            name: 'province',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'regency',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'subdistrict',
            type: 'varchar',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the areas table
    await queryRunner.dropTable('areas');
  }
}
