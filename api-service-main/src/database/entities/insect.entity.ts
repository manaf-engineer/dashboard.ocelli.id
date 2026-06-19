import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InsectImage } from './insect-image.entity';

@Entity('insects')
export class Insect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  scientific_name: string;

  @Column({ type: 'varchar' })
  common_name: string;

  @Column({ type: 'varchar' })
  role: string;

  @Column({ type: 'varchar' })
  family: string;

  @Column({ type: 'varchar' })
  order: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer', nullable: true })
  created_by?: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'integer', nullable: true })
  updated_by?: number;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updated_at?: Date;

  @OneToMany(() => InsectImage, (insectImage) => insectImage.insect)
  insect_images: InsectImage[];
}
