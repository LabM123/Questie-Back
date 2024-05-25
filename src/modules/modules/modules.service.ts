import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module } from './entities/module.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../courses/entities/course.entity';
import slugify from 'slugify';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module) private moduleRepository: Repository<Module>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) {}

  async createModule(createModuleDto: CreateModuleDto) {
    try {
      const { course_id } = createModuleDto;

      const foundCourse = await this.courseRepository.findOne({
        where: { id: course_id },
      });
      if (!foundCourse) {
        throw new NotFoundException('Course not found');
      }

      const slug = `${slugify(createModuleDto.title, {
        lower: true,
        replacement: '-',
        locale: 'en',
      })}-${new Date().getTime()}`;

      const savedModule = await this.moduleRepository.save(
        this.moduleRepository.create({
          ...createModuleDto,
          course: foundCourse,
          slug,
        }),
      );

      return await this.moduleRepository.findOne({
        where: { id: savedModule.id },
        loadRelationIds: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllModules(withDeleted: boolean = false) {
    return await this.moduleRepository.find({
      withDeleted,
      select: {
        lessons: {
          id: true,
          title: true,
        },
      },
      relations: ['lessons'],
    });
  }

  async getModulesById(id: string) {
    const moduleExists = await this.moduleRepository.findOne({
      where: { id },
      select: {
        lessons: {
          id: true,
          title: true,
          status: true,
        },
        course: {
          id: true,
        },
      },
      relations: ['lessons', 'course'],
    });
    if (!moduleExists) {
      throw new NotFoundException('Module not found');
    }

    return moduleExists;
  }

  async updateModule(id: string, updateModuleDto: UpdateModuleDto) {
    const foundModule = await this.moduleRepository.findOne({
      where: { id },
    });

    if (!foundModule) {
      throw new NotFoundException('Module not found');
    }

    if (updateModuleDto.title) {
      const slugTimestamp = foundModule.slug.split('-').pop();
      const slug = `${slugify(updateModuleDto.title, {
        lower: true,
        replacement: '-',
        locale: 'en',
      })}-${slugTimestamp}`;

      foundModule.slug = slug;
    }

    const updatedModule = await this.moduleRepository.update(id, {
      ...foundModule,
      ...updateModuleDto,
    });

    if (updatedModule.affected <= 0) {
      throw new InternalServerErrorException('Module not updated');
    }

    return await this.moduleRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

  async removeModule(id: string) {
    const moduleExists = await this.moduleRepository.findOne({ where: { id } });
    if (!moduleExists) {
      throw new NotFoundException('Module not found');
    }

    const deletedModule = await this.moduleRepository.update(id, {
      deleted_at: new Date(),
    });

    if (deletedModule.affected <= 0) {
      throw new InternalServerErrorException('Module not deleted');
    }

    return { message: 'Resource succesfully deleted' };
  }
}
