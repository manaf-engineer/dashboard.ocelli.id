import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TrapNode } from './trap-node.entity';

@Entity('areas')
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  area_id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  province: string;

  @Column({ type: 'varchar' })
  regency: string;

  @Column({ type: 'varchar' })
  subdistrict: string;

  @Column({ type: 'integer', nullable: true })
  created_by?: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'integer', nullable: true })
  updated_by?: number;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updated_at?: Date;

  @OneToMany(() => TrapNode, (trapNode) => trapNode.area)
  trap_nodes: TrapNode[];
}
