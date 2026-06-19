import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Area } from './area.entity';
import { EnvironmentDetail } from './environment-detail.entity';
import { CaptureResult } from './capture-result.entity';

@Entity('trap_nodes')
export class TrapNode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar'})
  trap_id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  latitude: string;

  @Column({ type: 'varchar' })
  longitude: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'boolean', default: false })
  connection: boolean;

  @Column({ type: 'integer', nullable: true })
  area_id?: number;

  @ManyToOne(() => Area, (area) => area.trap_nodes, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'area_id' })
  area?: Area;

  @Column({ type: 'integer', nullable: true })
  created_by?: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: string;

  @Column({ type: 'integer', nullable: true })
  updated_by?: number;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updated_at?: string;

  @OneToMany(
    () => EnvironmentDetail,
    (environmentDetail) => environmentDetail.trap_node,
  )
  environment_details: EnvironmentDetail[];

  @OneToMany(() => CaptureResult, (captureResult) => captureResult.trap_node)
  capture_results: CaptureResult[];

  // New Columns
  @Column({ type: 'integer', nullable: true })
  uptime?: number;

  @Column({ type: 'integer', nullable: true })
  battery_level?: number;

  @Column({ type: 'varchar', nullable: true, default: 'unknown' })
  battery_status?: string;

  @Column({ type: 'varchar', nullable: true, default: 'unknown' })
  wind_sensor_status?: string;

  @Column({ type: 'varchar', nullable: true, default: 'unknown' })
  light_sensor_status?: string;

  @Column({ type: 'varchar', nullable: true, default: 'unknown' })
  temperature_sensor_status?: string;

  @Column({ type: 'varchar', nullable: true, default: 'unknown' })
  humidity_sensor_status?: string;

  @Column({ type: 'varchar', nullable: true, default: 'unknown' })
  lamp_status?: string;

  @Column({ type: 'integer', nullable: true })
  signal?: number;

  @Column({ type: 'timestamptz', nullable: true })
  last_update?: Date;
}
