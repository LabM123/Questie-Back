import {
  BadRequestException,
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
    const { course_id } = createModuleDto;

    const foundCourse = await this.courseRepository.findOne({
      where: { id: course_id },
    });

    if (!foundCourse) {
      throw new BadRequestException('Course not found');
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
  }

  async getAllModules(withDeleted: boolean = false) {
    return await this.moduleRepository.find({
      withDeleted,
      loadRelationIds: true,
    });
  }

  async getModulesById(id: string) {
    const moduleExists = await this.moduleRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
    if (!moduleExists) {
      throw new NotFoundException('Module not found');
    }

    return moduleExists;
  }

  async updateModule(id: string, UpdateModuleDto: UpdateModuleDto) {
    const foundModule = await this.moduleRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });

    if (!foundModule) {
      throw new NotFoundException('Module not found');
    }

    if (UpdateModuleDto.title) {
      const slugTimestamp = foundModule.slug.split('-').pop();
      const slug = `${slugify(UpdateModuleDto.title, {
        lower: true,
        replacement: '-',
        locale: 'en',
      })}-${slugTimestamp}`;

      foundModule.slug = slug;
    }

    const updatedModule = await this.moduleRepository.update(id, {
      ...foundModule,
      ...UpdateModuleDto,
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
