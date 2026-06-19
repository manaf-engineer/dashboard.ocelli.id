import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn, RelationId
} from "typeorm";
import { SubFeature } from './sub-feature.entity';

@Entity('endpoints')
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  method: string;

  @ManyToOne(() => SubFeature, (subFeature) => subFeature.endpoints, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sub_features_id' })
  subFeature: SubFeature;

  @Column({ name: 'sub_features_id' })
  @RelationId((endpoint: Endpoint) => endpoint.subFeature)
  sub_features_id: number;
}
