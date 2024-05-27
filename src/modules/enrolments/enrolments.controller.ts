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
import { EnrolmentsService } from './enrolments.service';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { BuyCourseDto } from './dto/buyCourse.dto';

@ApiTags('Enrolments')
@Controller('enrolments')
export class EnrolmentsController {
  constructor(private readonly enrolmentsService: EnrolmentsService) {}

  @ApiBearerAuth()
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createEnrolmentDto: CreateEnrolmentDto) {
    return this.enrolmentsService.create(createEnrolmentDto);
  }

  @ApiBearerAuth()
  @Get()
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.enrolmentsService.findAll();
  }

  @ApiBearerAuth()
  @Get('/admin')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAllWithDeleted() {
    return this.enrolmentsService.findAll(true);
  }

  @ApiBearerAuth()
  @Get(':id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrolmentsService.findOne(id);
  }

  @ApiBearerAuth()
  @Get('user/:userId')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  findOneByUserId(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.enrolmentsService.findAllByUserId(userId);
  }

  @ApiBearerAuth()
  @Put(':id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEnrolmentDto: UpdateEnrolmentDto,
  ) {
    return this.enrolmentsService.update(id, updateEnrolmentDto);
  }

  @Post('buycourse')
  // @UseGuards(AuthGuard)
  buyCourse(
    @Body() buyCourseDto: BuyCourseDto
  ){
    return this.enrolmentsService.buyCourse(buyCourseDto)
  }

  @ApiBearerAuth()
  @Delete(':id')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrolmentsService.remove(id);
  }
}
