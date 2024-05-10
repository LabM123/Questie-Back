import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateModuleDto } from "./dto/create-module.dto";
import { UpdateModuleDto } from "./dto/update-module.dto";
import { Module } from "./entities/module.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Course } from "../courses/entities/course.entity";

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module) private moduleRepository: Repository<Module>,
    @InjectRepository(Course) private courseRepository: Repository<Course>
  ) {}

  async createModule(createModuleDto: CreateModuleDto) {
    const { course_id } = createModuleDto;

    const foundCourse = await this.courseRepository.findOne({where :{id :course_id}});

    if (!foundCourse) {
      throw new BadRequestException("Course not found");
    }

    const newModule = new Module();
    newModule.course_id = foundCourse;
    newModule.title = createModuleDto.title;

    const savedModule = await this.moduleRepository.save(newModule);

    return savedModule;
  }

  getAllModules() {
    return this.moduleRepository.find();
  }

  getModulesById(id: string) {
    return this.moduleRepository.findOne({ where: { id } });
  }

  async updateModule(id: string, UpdateModuleDto: UpdateModuleDto) {
    const foundedModule = this.moduleRepository.findOne({where:{id}})
    if(!foundedModule){
      throw new BadRequestException("Module not found")
    }
    const {course_id, ...updateModule } = UpdateModuleDto
    return this.moduleRepository.update(id, updateModule);
  }

  async removeModule(id: string) {
    return this.moduleRepository.update(id, {
      deleted_at: new Date(),
    });
  }
}
