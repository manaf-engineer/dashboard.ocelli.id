import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'task_scheduler_message' })
export class TaskSchedulerMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  topic: string;

  @Column()
  msg: string;

  @Column()
  msg_id: string;
}
