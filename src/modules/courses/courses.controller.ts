import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'courseImg', maxCount: 1 },
        { name: 'courseBgImg', maxCount: 1 },
      ],
      {
        fileFilter(req, file, callback) {
          if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
          }
          if (file.size > 5000000) {
            return callback(
              new Error('File size should be less than 5mb'),
              false,
            );
          }
          callback(null, true);
        },
      },
    ),
  )
  @Post()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        courseImg: {
          type: 'string',
          format: 'binary',
        },
        courseBgImg: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string' },
        headline: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  @ApiOperation({
    summary: 'Create Course',
    description: 'Create a new course.',
  })
  @ApiResponse({
    status: 201,
    description: 'The course has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(
    @UploadedFiles()
    files: {
      courseImg: Express.Multer.File[];
      courseBgImg: Express.Multer.File[];
    },
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.coursesService.createCourse(createCourseDto, files);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Courses',
    description: 'Retrieve all courses.',
  })
  @ApiResponse({ status: 200, description: 'Returns all courses.' })
  async findAll() {
    return this.coursesService.getAllCourses();
  }

  @ApiBearerAuth()
  @Get('/admin')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get All Courses (Admin)',
    description: 'Retrieve all courses, including deleted ones.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all courses including deleted ones.',
  })
  async findAllWithDeleted() {
    return this.coursesService.getAllCourses(true);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Course by ID',
    description: 'Retrieve a course by its ID.',
  })
  @ApiParam({ name: 'id', description: 'Course ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Returns the course.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.getCourseById(id);
  }

  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'courseImg', maxCount: 1 },
        { name: 'courseBgImg', maxCount: 1 },
      ],
      {
        fileFilter(req, file, callback) {
          if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return callback(new Error('Only image files are allowed!'), false);
          }
          if (file.size > 5000000) {
            return callback(
              new Error('File size should be less than 5mb'),
              false,
            );
          }
          callback(null, true);
        },
      },
    ),
  )
  @Put(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        courseImg: {
          type: 'string',
          format: 'binary',
        },
        courseBgImg: {
          type: 'string',
          format: 'binary',
        },
        title: { type: 'string' },
        headline: { type: 'string' },
        description: { type: 'string' },
        categories: { type: 'string' },
      },
    },
  })
  @ApiOperation({
    summary: 'Update Course',
    description: 'Update an existing course by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async update(
    @UploadedFiles()
    files: {
      courseImg?: Express.Multer.File[];
      courseBgImg?: Express.Multer.File[];
    } = null,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto, files);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Delete Course',
    description: 'Delete a course by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The course has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.deleteCourse(id);
  }

  @ApiBearerAuth()
  @Delete('category/:courseId')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Delete category of a course',
    description: 'Delete a category of a course by its ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'The category has been successfully deleted from the course.',
  })
  @ApiResponse({ status: 404, description: 'category or course not found.' })
  async deleteCategoryFromCourse(
    @Param('courseId') courseId: string,
    @Body('categoryId') categoryId: string,
  ) {
    return this.coursesService.deleteCategoryFromCourse(courseId, categoryId);
  }
}
