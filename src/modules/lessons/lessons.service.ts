import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Repository } from 'typeorm';
import { Module } from '../modules/entities/module.entity';
import slugify from 'slugify';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Module) private moduleRepository: Repository<Module>,
  ) {}

  async getAllLessons(withDeleted: boolean = false) {
    return await this.lessonsRepository.find({
      loadRelationIds: true,
      withDeleted,
    });
  }

  async getLessonById(id: string) {
    const lesson = await this.lessonsRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async createLesson(createLessonDto: CreateLessonDto) {
    try {
      const { module_id, order } = createLessonDto;
      const foundModule = await this.moduleRepository.findOne({
        where: { id: module_id },
        loadRelationIds: true,
      });
      if (!foundModule) throw new NotFoundException('Module not found');

      const moduleLessons = foundModule.lessons;
      const orderExists = moduleLessons.find(
        (lesson) => lesson.order === order,
      );
      if (orderExists) {
        throw new ConflictException('Lesson order already exists');
      }

      const slug = `${slugify(createLessonDto.title, {
        lower: true,
        replacement: '-',
        locale: 'en',
      })}-${new Date().getTime()}`;

      const newLesson = await this.lessonsRepository.save(
        this.lessonsRepository.create({
          module: foundModule,
          order,
          ...createLessonDto,
          slug,
        }),
      );

      return await this.lessonsRepository.findOne({
        where: { id: newLesson.id },
        loadRelationIds: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateLesson(id: string, updateLessonDto: UpdateLessonDto) {
    const foundLesson = await this.lessonsRepository.findOne({ where: { id } });
    if (!foundLesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (updateLessonDto.title) {
      const slugTimestamp = foundLesson.slug.split('-').pop();
      const slug = `${slugify(updateLessonDto.title, {
        lower: true,
        replacement: '-',
        locale: 'en',
      })}-${slugTimestamp}`;

      foundLesson.slug = slug;
    }

    if (updateLessonDto.module_id) {
      const foundModule = await this.moduleRepository.findOne({
        where: { id: updateLessonDto.module_id },
      });
      if (!foundModule) {
        throw new BadRequestException('Module not found');
      }

      delete updateLessonDto.module_id;

      const updatedLesson = await this.lessonsRepository.update(id, {
        module: foundModule,
        ...foundLesson,
        ...updateLessonDto,
      });

      if (updatedLesson.affected <= 0) {
        throw new InternalServerErrorException('Lesson not updated');
      }
      return await this.lessonsRepository.findOne({ where: { id } });
    } else {
      const updatedLesson = await this.lessonsRepository.update(id, {
        ...foundLesson,
        ...updateLessonDto,
      });

      if (updatedLesson.affected <= 0) {
        throw new InternalServerErrorException('Lesson not updated');
      }

      return await this.lessonsRepository.findOne({
        where: { id },
        loadRelationIds: true,
      });
    }
  }

  async removeLesson(id: string) {
    const lesson = await this.lessonsRepository.findOne({ where: { id } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const deletedLesson = await this.lessonsRepository.update(id, {
      deleted_at: new Date(),
    });

    if (deletedLesson.affected <= 0) {
      throw new InternalServerErrorException('Lesson not deleted');
    }

    return { message: 'Resource succesfully deleted' };
  }
}
