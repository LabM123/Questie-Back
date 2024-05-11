import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  findAll() {
    return this.lessonsService.getAllLessons();
  }

  @ApiBearerAuth()
  @Get('/admin')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAllWithDeleted() {
    return this.lessonsService.getAllLessons(true);
  }
  
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.getLessonById(id);
  }
  
  @ApiBearerAuth()
  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createCourseDto: CreateLessonDto) {
    return this.lessonsService.createLesson(createCourseDto);
  }
  
  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateLessonDto,
  ) {
    return this.lessonsService.updateLesson(id, updateCourseDto);
  }
  
  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.removeLesson(id);
  }
}
