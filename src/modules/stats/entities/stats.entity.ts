import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Stats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ default: 0 })
  coins: number;

  @Column({ default: 0 })
  xp: number;
}
