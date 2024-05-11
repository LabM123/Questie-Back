import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { UploadfileModule } from '../uploadfile/uploadfile.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), UploadfileModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
