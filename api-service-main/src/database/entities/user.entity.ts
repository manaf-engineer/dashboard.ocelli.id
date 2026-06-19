import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  photo: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  status: boolean;

  @Column()
  password_reset_token: string;

  @Column({
    type: 'timestamptz',
  })
  password_reset_at: Date;

  @Column({ nullable: true })
  created_by: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ type: 'timestamptz', nullable: true })
  updated_at: Date;

  @Column({ type: 'integer' })
  role_id: number;

  @ManyToOne(() => Role, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
