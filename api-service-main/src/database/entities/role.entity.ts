import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Policy } from './policy.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  label: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  created_by: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  updated_by: number;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => User, (user) => user.role, { nullable: true })
  users: User[];

  @OneToMany(() => Policy, (policy) => policy.role, { nullable: true })
  policies: Policy[];
}
