import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UploadfileModule } from '../uploadfile/uploadfile.module';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Category]), UploadfileModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
