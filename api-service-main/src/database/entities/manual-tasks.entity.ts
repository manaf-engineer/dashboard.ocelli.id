import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'manual_tasks' })
export class ManualTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  task_id: string;

  @Column()
  type: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ type: 'timestamptz', nullable: true })
  updated_at: Date;
}
