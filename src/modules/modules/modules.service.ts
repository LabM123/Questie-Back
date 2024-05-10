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

    const newModule = new Module();
    newModule.course = foundCourse;
    newModule.title = createModuleDto.title;

    const savedModule = await this.moduleRepository.save(newModule);

    return savedModule;
  }

  async getAllModules(withDeleted: boolean = false) {
    return await this.moduleRepository.find({ withDeleted });
  }

  async getModulesById(id: string) {
    const moduleExists = await this.moduleRepository.findOne({ where: { id } });
    if (!moduleExists) {
      throw new NotFoundException('Module not found');
    }

    return moduleExists;
  }

  async updateModule(id: string, UpdateModuleDto: UpdateModuleDto) {
    const foundedModule = await this.moduleRepository.findOne({
      where: { id },
    });
    if (!foundedModule) {
      throw new BadRequestException('Module not found');
    }
    const { course_id, ...updateModule } = UpdateModuleDto;

    const updatedModule = await this.moduleRepository.update(id, updateModule);

    if (updatedModule.affected <= 0) {
      throw new InternalServerErrorException('Module not updated');
    }

    return await this.moduleRepository.findOne({ where: { id } });
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

    return 'Module deleted successfully';
  }
}
