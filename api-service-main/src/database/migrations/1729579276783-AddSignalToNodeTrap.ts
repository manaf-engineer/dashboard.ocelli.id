import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSignalToNodeTrap1729579276783 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'trap_nodes',
      new TableColumn({
        name: 'signal',
        type: 'integer',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('trap_nodes', 'signal');
  }
}
