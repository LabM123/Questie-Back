import { User } from 'src/modules/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity()
export class Stats {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 0 })
  coins: number;

  @Column({ default: 0 })
  xp: number;

  @OneToOne(() => User, (user) => user.stats)
  user: User;
}
