import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateLessonDto } from "./dto/create-lesson.dto";
import { UpdateLessonDto } from "./dto/update-lesson.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Lesson } from "./entities/lesson.entity";
import { Repository } from "typeorm";
import { Module } from "../modules/entities/module.entity";

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonsRepository: Repository<Lesson>,
    @InjectRepository(Module) private moduleRepository: Repository<Module>
  ) {}

  async getAllLessons() {
    return this.lessonsRepository.find();
  }

  async getLessonById(id: string) {
    return this.lessonsRepository.findOne({ where: { id } });
  }

  async createLesson(createLessonDto: CreateLessonDto) {
    try {
      const { module_id } = createLessonDto;
      const foundModule = await this.moduleRepository.findOne({
        where: { id: module_id },
      });

      if (!foundModule) throw new BadRequestException("Module not found");

      const newLesson = new Lesson();
      newLesson.module = foundModule
      newLesson.order = createLessonDto.order;
      newLesson.xp = createLessonDto.xp;

      const savedLesson = await this.lessonsRepository.save(newLesson);
      return savedLesson;
    } catch (error:any) {
      throw new BadRequestException(error.message);
    }
  }

  async updateLesson(id: string, updateLessonDto: UpdateLessonDto) {
    return this.lessonsRepository.update(id, updateLessonDto);
  }

  async removeLesson(id: string) {
    return this.lessonsRepository.update(id, {
      deleted_at: new Date(),
    });
  }
}
