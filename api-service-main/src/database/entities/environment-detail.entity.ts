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

@Entity('environment_details')
export class EnvironmentDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', nullable: true })
  wind_speed?: number;

  @Column({ type: 'float', nullable: true })
  light_intensity?: number;

  @Column({ type: 'float', nullable: true })
  temperature?: number;

  @Column({ type: 'float', nullable: true })
  humidity?: number;

  @Column({ type: 'integer' })
  trap_node_id: number;

  @ManyToOne(() => TrapNode, (trapNode) => trapNode.environment_details, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trap_node_id' })
  trap_node: TrapNode;

  @Column({ type: 'timestamptz' })
  collection_time: Date;

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
