import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UploadfileService } from '../uploadfile/uploadfile.service';
import slugify from 'slugify';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private coursesRepository: Repository<Course>,
    private readonly uploadfileService: UploadfileService,
  ) {}

  async getAllCourses(withDeleted: boolean = false) {
    try {
      //Select only title, id and lessons of each module
      const allCourses = await this.coursesRepository.find({
        withDeleted,
        select: {
          modules: {
            id: true,
            title: true,
            lessons: {
              id: true,
              title: true,
            },
          },
          categories: {
            id: true,
            name: true,
          },
        },
        relations: ['modules', 'modules.lessons', 'categories'],
      });

      return allCourses;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async getCourseById(id: string) {
    try {
      const foundedCourse = await this.coursesRepository.findOne({
        where: { id },
        select: {
          modules: {
            id: true,
            title: true,
            status: true,
            lessons: {
              id: true,
              title: true,
              status: true,
            },
          },
          categories: {
            id: true,
            name: true,
          },
        },
        relations: ['modules', 'modules.lessons', 'categories'],
      });
      if (!foundedCourse) throw new NotFoundException('Course not found');
      return foundedCourse;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async createCourse(
    createCourseDto: CreateCourseDto,
    files: {
      courseImg?: Express.Multer.File[];
      courseBgImg?: Express.Multer.File[];
    } | null,
  ) {
    try {
      if (
        !files ||
        !files.courseImg ||
        !files.courseBgImg ||
        !files.courseImg.length ||
        !files.courseBgImg.length
      )
        throw new BadRequestException(
          'Course image and background image are required',
        );

      const courseImgUrl = await this.uploadfileService.uploadFile(
        files.courseImg[0],
      );

      const courseBgImgUrl = await this.uploadfileService.uploadFile(
        files.courseBgImg[0],
      );

      const slug = `${slugify(createCourseDto.title, {
        lower: true,
        replacement: '-',
        locale: 'en',
      })}-${new Date().getTime()}`;

      const newCourse = await this.coursesRepository.save(
        this.coursesRepository.create({
          ...createCourseDto,
          image: courseImgUrl.url,
          bg_image: courseBgImgUrl.url,
          slug,
        }),
      );

      return newCourse;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateCourse(
    id: string,
    updateCourseDto: UpdateCourseDto,
    files: {
      courseImg?: Express.Multer.File[];
      courseBgImg?: Express.Multer.File[];
    } | null,
  ) {
    try {
      const foundCourse = await this.coursesRepository.findOne({
        where: { id },
      });
      if (!foundCourse) throw new NotFoundException('Course not found');

      if (files) {
        if (files.courseImg && files.courseImg.length) {
          foundCourse.image = (
            await this.uploadfileService.uploadFile(files.courseImg[0])
          ).url;
        }

        if (files.courseBgImg && files.courseBgImg.length)
          foundCourse.bg_image = (
            await this.uploadfileService.uploadFile(files.courseBgImg[0])
          ).url;
      }

      if (updateCourseDto.title) {
        const slugTimestamp = foundCourse.slug.split('-').pop();
        const slug = `${slugify(updateCourseDto.title, {
          lower: true,
          replacement: '-',
          locale: 'en',
        })}-${slugTimestamp}`;

        foundCourse.slug = slug;
      }

      await this.coursesRepository.update(id, {
        ...foundCourse,
        ...updateCourseDto,
      });

      return await this.coursesRepository.findOne({
        where: { id },
        loadRelationIds: true,
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteCourse(id: string) {
    try {
      const foundedCourse = await this.coursesRepository.findOne({
        where: { id },
      });
      if (!foundedCourse) throw new NotFoundException('Course not found');
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
