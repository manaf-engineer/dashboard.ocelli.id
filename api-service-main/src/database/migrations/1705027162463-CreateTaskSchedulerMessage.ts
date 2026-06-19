import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTaskSchedulerMessage1705027162463
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'task_scheduler_message',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'topic', type: 'text' },
          { name: 'msg', type: 'text', isNullable: true },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('task_scheduler_message');
  }
}
