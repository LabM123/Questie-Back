import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../courses/entities/course.entity';
import { Product } from '../products/entities/product.entity';
import { Module as ModuleEntity } from '../modules/entities/module.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Course, ModuleEntity, Category]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
