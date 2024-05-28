import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PolymorphicEntityType {
  Course = 'Course',
  Module = 'Module',
  Lesson = 'Lesson',
  Content = 'Content',
}

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: string;

  @Column({ default: 'https://placehold.co/600x400.png' })
  imgUrl: string;

  @Column({ nullable: true })
  order: number;

  @Column({ type: 'json', nullable: true })
  data: JSON;

  @Column({ enum: PolymorphicEntityType, nullable: true })
  polymorphicEntityType: string;

  @Column({ type: 'uuid', nullable: true, default: null, unique: true })
  polymorphicEntityId: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
