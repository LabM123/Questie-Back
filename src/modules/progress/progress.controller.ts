import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  @ApiOperation({ summary: 'Mark lesson as completed' })
  @ApiResponse({
    status: 201,
    description: 'Progress has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'User or Lesson not found.' })
  @ApiBody({ type: CreateProgressDto })
  async markAsCompleted(@Body() createProgressDto: CreateProgressDto) {
    return this.progressService.markAsCompleted(createProgressDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get progress for a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user', example: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user progress.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getProgressForUser(@Param('userId') userId: string) {
    return this.progressService.getProgressForUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get progress by ID' })
  @ApiParam({ name: 'id', description: 'ID of the progress', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved progress.' })
  @ApiResponse({ status: 404, description: 'Progress not found.' })
  async findOne(@Param('id') id: string) {
    return this.progressService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update progress' })
  @ApiParam({ name: 'id', description: 'ID of the progress', example: 'uuid' })
  @ApiBody({ type: UpdateProgressDto })
  @ApiResponse({ status: 200, description: 'Successfully updated progress.' })
  @ApiResponse({ status: 404, description: 'Progress not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.progressService.update(id, updateProgressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete progress' })
  @ApiParam({ name: 'id', description: 'ID of the progress', example: 'uuid' })
  @ApiResponse({ status: 200, description: 'Successfully deleted progress.' })
  @ApiResponse({ status: 404, description: 'Progress not found.' })
  async remove(@Param('id') id: string) {
    return this.progressService.remove(id);
  }

  @Get('module/:moduleId/user/:userId')
  @ApiOperation({ summary: 'Get progress for a module' })
  @ApiParam({ name: 'userId', description: 'ID of the user', example: 'uuid' })
  @ApiParam({
    name: 'moduleId',
    description: 'ID of the module',
    example: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved module progress.',
  })
  @ApiResponse({ status: 404, description: 'User or Module not found.' })
  async getModuleProgress(
    @Param('userId') userId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.progressService.getModuleProgress(userId, moduleId);
  }

  @Get('course/:courseId/user/:userId')
  @ApiOperation({ summary: 'Get progress for a course' })
  @ApiParam({ name: 'userId', description: 'ID of the user', example: 'uuid' })
  @ApiParam({
    name: 'courseId',
    description: 'ID of the course',
    example: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved course progress.',
  })
  @ApiResponse({ status: 404, description: 'User or Course not found.' })
  async getCourseProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.progressService.getCourseProgress(userId, courseId);
  }
}
