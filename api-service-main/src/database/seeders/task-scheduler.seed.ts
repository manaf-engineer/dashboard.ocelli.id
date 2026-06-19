import { DataSource } from 'typeorm';
import { TaskScheduler } from '../entities/task-scheduler.entity';

export async function TaskSchedulerSeed(dataSource: DataSource): Promise<any> {
  const taskSchedulerRepository = dataSource.getRepository(TaskScheduler);

  const taskSchedulerData = [
    {
      name: 'lingkungan',
      type: 'cron',
      expression: '3',
    },
    {
      name: 'foto',
      type: 'cron',
      expression: '3',
    },
    {
      name: 'healthcheck',
      type: 'cron',
      expression: '3',
    },
  ];

  for (const task of taskSchedulerData) {
    const existingTask = await taskSchedulerRepository.findOneBy({
      name: task.name,
    });
    if (!existingTask) {
      await taskSchedulerRepository.insert(task);
      console.log(`Inserted task scheduler: ${task.name}`);
    } else {
      console.log(`Task scheduler with name "${task.name}" already exists.`);
    }
  }
}
