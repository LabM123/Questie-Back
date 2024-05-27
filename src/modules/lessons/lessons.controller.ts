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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @ApiBearerAuth()
  @Get()
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all lessons' })
  @ApiResponse({ status: 200, description: 'All lessons retrieved.' })
  findAll() {
    return this.lessonsService.getAllLessons();
  }

  @ApiBearerAuth()
  @Get('/admin')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all lessons including deleted' })
  @ApiResponse({
    status: 200,
    description: 'All lessons including deleted retrieved.',
  })
  findAllWithDeleted() {
    return this.lessonsService.getAllLessons(true);
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a lesson by ID' })
  @ApiResponse({ status: 200, description: 'Lesson retrieved.' })
  @ApiResponse({ status: 404, description: 'Lesson not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.getLessonById(id);
  }

  @ApiBearerAuth()
  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create lessons' })
  @ApiResponse({ status: 201, description: 'Lessons created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createLessonDtos: CreateLessonDto[]) {
    return this.lessonsService.createLesson(createLessonDtos);
  }

  @ApiBearerAuth()
  @Put()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Update lessons' })
  @ApiResponse({ status: 200, description: 'Lessons updated.' })
  @ApiResponse({ status: 404, description: 'Lesson not found.' })
  update(
    @Body() lessonsDtoArray: { id: string; updateLessonDto: UpdateLessonDto }[],
  ) {
    return this.lessonsService.updateLesson(lessonsDtoArray);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a lesson by ID' })
  @ApiResponse({ status: 200, description: 'Lesson deleted.' })
  @ApiResponse({ status: 404, description: 'Lesson not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lessonsService.removeLesson(id);
  }
}
