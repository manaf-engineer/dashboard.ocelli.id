import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Feature } from './feature.entity';
import { SubFeature } from './sub-feature.entity';
import { Role } from './role.entity';

@Entity({ name: 'policies' })
export class Policy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  status: boolean;

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
  @RelationId((policy: Policy) => policy.feature)
  features_id: number;

  @ManyToOne(() => SubFeature)
  @JoinColumn({ name: 'sub_features_id' })
  sub_feature: SubFeature;

  @Column({ name: 'sub_features_id' })
  @RelationId((policy: Policy) => policy.sub_feature)
  sub_features_id: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ name: 'role_id' })
  @RelationId((policy: Policy) => policy.role)
  role_id: number;
}
