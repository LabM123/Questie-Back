import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.getAllCourses();
  }

  @Get('/admin')
  findAllWithDeleted() {
    return this.coursesService.getAllCourses(true);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.getCourseById(id);
  }

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
  create(
    @UploadedFiles()
    files: {
      courseImg?: Express.Multer.File[];
      courseBgImg?: Express.Multer.File[];
    },
    @Body() createCourseDto: CreateCourseDto,
  ) {
    return this.coursesService.createCourse(createCourseDto, files);
  }

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
  update(
    @UploadedFiles()
    files: {
      courseImg: Express.Multer.File[];
      courseBgImg: Express.Multer.File[];
    } = null,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.deleteCourse(id);
  }
}
