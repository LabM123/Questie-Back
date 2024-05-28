import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Assessment } from 'src/modules/assessment/entities/assessment.entity';
import { Enrolment } from 'src/modules/enrolments/entities/enrolment.entity';
import { Stats } from 'src/modules/stats/entities/stats.entity';
import { Progress } from 'src/modules/progress/entities/progress.entity';

@Entity()
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 'https://placehold.co/200x200' })
  profile_pic: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthdate?: Date;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;

  @OneToMany(() => Assessment, (assessment) => assessment.user)
  assessment: Assessment[];

  @OneToOne(() => Stats, (stats) => stats.user)
  @JoinColumn({ name: 'stats_id' })
  stats: Stats;

  @OneToMany(() => Enrolment, (enrolment) => enrolment.user)
  enrolments: Enrolment[];

  @OneToMany(() => Progress, (progress) => progress.user)
  progresses: Progress[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
