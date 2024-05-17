import { Course } from 'src/modules/courses/entities/course.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Unique,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'categories' })
@Unique(['name'])
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column({ default: 'programacion' })
  slug: string;

  @Column({ default: 'https://placehold.co/600x400.png' })
  image: string;

  @ManyToMany(() => Course, (course) => course.categories)
  courses: Course[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
