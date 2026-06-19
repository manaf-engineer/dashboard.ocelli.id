import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Insect } from './insect.entity';
import { Tag } from './tag.entity';

@Entity('insect_images')
export class InsectImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'integer' })
  insect_id: number;

  @ManyToOne(() => Insect, (insect) => insect.insect_images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'insect_id' })
  insect: Insect;

  @ManyToMany(() => Tag, (tag) => tag.insectImages, { cascade: true })
  @JoinTable({
    name: 'image_tags',
    joinColumn: {
      name: 'image_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  @Column({ type: 'integer', nullable: true })
  created_by?: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'integer', nullable: true })
  updated_by?: number;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updated_at?: Date;
}
