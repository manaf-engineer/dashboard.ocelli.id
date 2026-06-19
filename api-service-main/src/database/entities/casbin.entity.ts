import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'casbin_rule' })
export class Casbin {
  @Column({ nullable: true })
  ptype: string;

  @Column({ nullable: true })
  v0: string;

  @Column({ nullable: true })
  v1: string;

  @Column({ nullable: true })
  v2: string;

  @Column({ nullable: true })
  v3: string;

  @Column({ nullable: true })
  v4: string;

  @Column({ nullable: true })
  v5: string;

  @Column({ nullable: true })
  v6: string;

  @PrimaryGeneratedColumn()
  id: number;
}
