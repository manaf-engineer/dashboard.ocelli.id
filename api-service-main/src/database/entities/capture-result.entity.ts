import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { TrapNode } from './trap-node.entity';

@Entity('capture_results')
export class CaptureResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  image?: string;

  @Column({ type: 'timestamptz' })
  collection_time: Date;

  @Column({ type: 'integer' })
  trap_node_id: number;

  @ManyToOne(() => TrapNode, (trap_node) => trap_node.capture_results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trap_node_id' })
  trap_node: TrapNode;

  @Column({ type: 'integer', nullable: true })
  created_by?: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'integer', nullable: true })
  updated_by?: number;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updated_at?: Date;

  @Column({ type: 'varchar', nullable: true })
  message_id?: string;
}
