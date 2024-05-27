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

  async createModule(
    createModuleDtoArray: CreateModuleDto[],
  ): Promise<Module[]> {
    try {
      const savedModules: Module[] = [];

      for (const createModuleDto of createModuleDtoArray) {
        const { course_id, title } = createModuleDto;

        const foundCourse = await this.courseRepository.findOne({
          where: { id: course_id },
        });

        if (!foundCourse) {
          throw new NotFoundException(`Course with id ${course_id} not found`);
        }

        const slug = `${slugify(title, {
          lower: true,
          replacement: '-',
          locale: 'en',
        })}-${new Date().getTime()}`;

        const moduleToSave = this.moduleRepository.create({
          ...createModuleDto,
          course: foundCourse,
          slug,
        });

        const savedModule = await this.moduleRepository.save(moduleToSave);

        savedModules.push(
          await this.moduleRepository.findOne({
            where: { id: savedModule.id },
            loadRelationIds: true,
          }),
        );
      }

      return savedModules;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
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

  async updateModule(
    id: string,
    updateModuleDtoArray: UpdateModuleDto[],
  ): Promise<Module[]> {
    try {
      const updatedModules: Module[] = [];

      for (const updateModuleDto of updateModuleDtoArray) {
        const { title } = updateModuleDto;

        const foundModule = await this.moduleRepository.findOne({
          where: { id },
        });

        if (!foundModule) {
          throw new NotFoundException(`Module with id ${id} not found`);
        }

        if (title) {
          const slugTimestamp = foundModule.slug.split('-').pop();
          const slug = `${slugify(title, {
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
          throw new InternalServerErrorException(
            `Module with id ${id} not updated`,
          );
        }

        const reloadedModule = await this.moduleRepository.findOne({
          where: { id },
          loadRelationIds: true,
        });

        if (reloadedModule) {
          updatedModules.push(reloadedModule);
        }
      }

      return updatedModules;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
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
