import { Enrolment } from 'src/modules/enrolments/entities/enrolment.entity';
import { Lesson } from 'src/modules/lessons/entities/lesson.entity';
import { Stats } from 'src/modules/stats/entities/stats.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Unique,
  OneToMany,
} from 'typeorm';

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

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;

  @OneToOne(() => Stats, (stats) => stats.user)
  @JoinColumn({ name: 'stats_id' })
  stats: Stats;

  @OneToMany(() => Enrolment, (enrolment) => enrolment.user)
  enrolments: Enrolment[];

  @ManyToMany(() => Lesson)
  @JoinTable({ name: 'progress' })
  lessons: Lesson[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
