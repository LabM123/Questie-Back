import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Content } from '../contents/entities/content.entity';
import { Course } from '../courses/entities/course.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Module as ModuleEntity } from '../modules/entities/module.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Course, ModuleEntity, Content, Lesson]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
