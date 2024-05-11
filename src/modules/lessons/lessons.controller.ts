import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  findAll() {
    return this.lessonsService.getAllLessons();
  }

  @Get('/admin')
  findAllWithDeleted() {
    return this.lessonsService.getAllLessons(true);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.getLessonById(id);
  }

  @Post()
  create(@Body() createCourseDto: CreateLessonDto) {
    return this.lessonsService.createLesson(createCourseDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateLessonDto,
  ) {
    return this.lessonsService.updateLesson(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.removeLesson(id);
  }
}
