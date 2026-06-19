import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  trap_id: string;
}
