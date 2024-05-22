import { Status } from 'src/helpers/status.enum';
import { Course } from 'src/modules/courses/entities/course.entity';
import { Lesson } from 'src/modules/lessons/entities/lesson.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ nullable: true, default: 'https://placehold.co/600x400' })
  image: string;

  @Column({ nullable: true, default: 'Absolutely amazing module' })
  description: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @OneToMany(() => Lesson, (lesson) => lesson.module)
  lessons: Lesson[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
