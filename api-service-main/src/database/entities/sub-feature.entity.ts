import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  RelationId
} from "typeorm";
import { Feature } from './feature.entity';
import { Endpoint } from "./endpoint.entity";

@Entity({ name: 'sub_features' })
export class SubFeature {
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

  @ManyToOne(() => Feature)
  @JoinColumn({ name: 'features_id' })
  feature: Feature;

  @Column({ name: 'features_id' })
  @RelationId((subFeature: SubFeature) => subFeature.feature)
  features_id: number;

  @OneToMany(() => Endpoint, (endpoint) => endpoint.subFeature)
  endpoints: Endpoint[];
}
