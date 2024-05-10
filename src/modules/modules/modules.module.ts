import { Module } from "@nestjs/common";
import { ModulesService } from "./modules.service";
import { ModulesController } from "./modules.controller";
import { Lesson } from "../lessons/entities/lesson.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module as ModuleEntity } from "../modules/entities/module.entity";
import { Course } from "../courses/entities/course.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, ModuleEntity, Course])],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
