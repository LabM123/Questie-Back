import { Module } from "@nestjs/common";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./lessons.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module as ModuleEntity } from "../modules/entities/module.entity";
import { Lesson } from "./entities/lesson.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Lesson, ModuleEntity])],
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
