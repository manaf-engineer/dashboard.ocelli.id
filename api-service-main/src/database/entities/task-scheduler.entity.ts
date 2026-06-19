import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'task_scheduler' })
export class TaskScheduler {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  expression: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ type: 'timestamptz', nullable: true })
  updated_at: Date;
}
