import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMessageIdOnTaskMessage1728609026537
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'task_scheduler_message',
      new TableColumn({
        name: 'msg_id',
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('task_scheduler_message', 'msg_id');
  }
}
