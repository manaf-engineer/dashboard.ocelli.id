import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateDevices1732510083012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'devices',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'trap_id', type: 'varchar', isUnique: true },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('devices');
  }
}
