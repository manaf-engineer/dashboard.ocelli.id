import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLampStatusToTrapNode1728530030596
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'trap_nodes',
      new TableColumn({
        name: 'lamp_status',
        type: 'varchar',
        isNullable: true,
        default: `'unknown'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('trap_nodes', 'lamp_status');
  }
}
