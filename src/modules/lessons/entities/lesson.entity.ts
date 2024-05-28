import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Module } from 'src/modules/modules/entities/module.entity';
import { Content } from 'src/modules/contents/entities/content.entity';
import { Status } from 'src/helpers/status.enum';
import { Progress } from 'src/modules/progress/entities/progress.entity';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  order: number;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 0 })
  coins: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => Module)
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @OneToMany(() => Content, (content) => content.lesson)
  contents: Content[];

  @OneToMany(() => Progress, (progress) => progress.lesson)
  progresses: Progress[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
