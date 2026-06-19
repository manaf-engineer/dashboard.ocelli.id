import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMessageIdToCaptureResult1727063371854
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'trap_nodes',
      new TableColumn({
        name: 'last_update',
        type: 'timestamptz',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'capture_results',
      new TableColumn({
        name: 'message_id',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'environment_details',
      new TableColumn({
        name: 'message_id',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('trap_nodes', 'last_update');
    await queryRunner.dropColumn('capture_results', 'message_id');
    await queryRunner.dropColumn('environment_details', 'message_id');
  }
}
