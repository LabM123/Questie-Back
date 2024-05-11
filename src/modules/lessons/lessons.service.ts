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
        relations: ['lessons'],
      });
      if (!foundModule) throw new NotFoundException('Module not found');

      const moduleLessons = foundModule.lessons;

      const orderExists = moduleLessons.find(
        (lesson) => lesson.order === order,
      );
      if (orderExists) {
        throw new ConflictException('Lesson order already exists');
      }

      const { module, ...newLesson } = await this.lessonsRepository.save(
        this.lessonsRepository.create({
          module: foundModule,
          order,
          ...createLessonDto,
        }),
      );

      return { ...newLesson, module: module.id };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateLesson(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.lessonsRepository.findOne({ where: { id } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
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
        ...updateLessonDto,
      });

      if (updatedLesson.affected <= 0) {
        throw new InternalServerErrorException('Lesson not updated');
      }
      return await this.lessonsRepository.findOne({ where: { id } });
    } else {
      const updatedLesson = await this.lessonsRepository.update(id, {
        ...updateLessonDto,
      });

      if (updatedLesson.affected <= 0) {
        throw new InternalServerErrorException('Lesson not updated');
      }

      return await this.lessonsRepository.findOne({ where: { id } });
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
