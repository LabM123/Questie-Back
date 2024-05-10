import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
  ) {}

  async getAllCourses(withDeleted: boolean = false) {
    try {
      const allCourses = await this.coursesRepository.find({ withDeleted });
      return allCourses;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async getCourseById(id: string) {
    try {
      const foundedCourse = await this.coursesRepository.findOne({
        where: { id },
      });
      if (!foundedCourse) throw new BadRequestException('Course not found');
      return foundedCourse;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async createCourse(createCourseDto: CreateCourseDto) {
    try {
      const newCourse = await this.coursesRepository.save(createCourseDto);
      return newCourse;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const foundedCourse = await this.coursesRepository.findOne({
        where: { id },
      });
      if (!foundedCourse) throw new BadRequestException('Course not found');
      await this.coursesRepository.update(id, updateCourseDto);
      const updatedCourse = await this.coursesRepository.findOne({
        where: { id },
      });
      return updatedCourse;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteCourse(id: string) {
    try {
      const foundedCourse = await this.coursesRepository.findOne({
        where: { id },
      });
      if (!foundedCourse) throw new BadRequestException('Course not found');
      foundedCourse.deleted_at = new Date();
      await this.coursesRepository.update(id, foundedCourse);
      const deletedCourse = await this.coursesRepository.findOne({
        where: { id },
      });
      return deletedCourse;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
