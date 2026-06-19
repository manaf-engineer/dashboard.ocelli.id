import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddSensorsColumnToTrapNode1727048650049
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'trap_nodes',
      new TableColumn({
        name: 'uptime',
        type: 'integer',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'trap_nodes',
      new TableColumn({
        name: 'battery_level',
        type: 'integer',
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'trap_nodes',
      new TableColumn({
        name: 'battery_status',
        type: 'varchar',
        isNullable: true,
        default: `'unknown'`,
      }),
    );

    await queryRunner.addColumn(
      'trap_nodes',
      new TableColumn({
        name: 'wind_sensor_status',
        type: 'varchar',
        isNullable: true,
        default: `'unknown'`,
      }),
    );

    await queryRunner.addColumn(
      'trap_nodes',
      new TableColumn({
        name: 'light_sensor_status',
        type: 'varchar',
        isNullable: true,
        default: `'unknown'`,
      }),
    );

    await queryRunner.addColumn(
      'trap_nodes',
      new TableColumn({
        name: 'temperature_sensor_status',
        type: 'varchar',
        isNullable: true,
        default: `'unknown'`,
      }),
    );

    await queryRunner.addColumn(
      'trap_nodes',
      new TableColumn({
        name: 'humidity_sensor_status',
        type: 'varchar',
        isNullable: true,
        default: `'unknown'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('trap_nodes', 'uptime');
    await queryRunner.dropColumn('trap_nodes', 'battery_level');
    await queryRunner.dropColumn('trap_nodes', 'battery_status');
    await queryRunner.dropColumn('trap_nodes', 'wind_sensor_status');
    await queryRunner.dropColumn('trap_nodes', 'light_sensor_status');
    await queryRunner.dropColumn('trap_nodes', 'temperature_sensor_status');
    await queryRunner.dropColumn('trap_nodes', 'humidity_sensor_status');
  }
}
