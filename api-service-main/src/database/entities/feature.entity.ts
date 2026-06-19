import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubFeature } from './sub-feature.entity';

@Entity({ name: 'features' })
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ type: 'timestamptz', nullable: true })
  updated_at: Date;

  @OneToMany(() => SubFeature, (subFeature) => subFeature.feature)
  sub_features: SubFeature[];
}
