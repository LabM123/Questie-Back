import { Status } from 'src/helpers/status.enum';
import { Assessment } from 'src/modules/assessment/entities/assessment.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Module } from 'src/modules/modules/entities/module.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Unique,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
@Entity({ name: 'courses' })
@Unique(['slug'])
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  headline: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  bg_image: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column({ default: false })
  isProduct: boolean;

  @OneToMany(() => Assessment, (assessment) => assessment.course)
  assessment: Assessment[];

  @ManyToMany(() => Category, (category) => category.courses)
  @JoinTable({ name: 'category_course' })
  categories: Category[];

  @OneToMany(() => Module, (module) => module.course)
  modules: Module[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
