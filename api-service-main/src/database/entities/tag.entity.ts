import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { InsectImage } from './insect-image.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => InsectImage, (insectImage) => insectImage.tags)
  insectImages: InsectImage[];
}
