import { Course } from 'src/modules/courses/entities/course.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
@Unique(['user', 'course'])
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column({ default: 1 })
  score: number;

  @ManyToOne(() => User, (user) => user.assessment)
  user: User;

  @ManyToOne(() => Course, (course) => course.assessment)
  course: Course;

  @CreateDateColumn()
  created_at: Date;
}
