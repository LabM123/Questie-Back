import { Content } from 'src/modules/contents/entities/content.entity';
import { Module } from 'src/modules/modules/entities/module.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity()
export class Lesson {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  title: string;

  @Column()
  order: number;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 0 })
  coins: number;

  @Column({ unique: true })
  slug: string;

  @ManyToOne(() => Module)
  @JoinColumn({ name: 'module_id' })
  module: Module;

  @OneToMany(() => Content, (content) => content.lesson)
  contents: Content[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
