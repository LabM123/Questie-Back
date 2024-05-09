import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { EnrolmentsService } from './enrolments.service';
import { CreateEnrolmentDto } from './dto/create-enrolment.dto';
import { UpdateEnrolmentDto } from './dto/update-enrolment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Enrolments")
@Controller('enrolments')
export class EnrolmentsController {
  constructor(private readonly enrolmentsService: EnrolmentsService) {}

  @Post()
  create(@Body() createEnrolmentDto: CreateEnrolmentDto) {
    return this.enrolmentsService.create(createEnrolmentDto);
  }

  @Get()
  findAll() {
    return this.enrolmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrolmentsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnrolmentDto: UpdateEnrolmentDto,
  ) {
    return this.enrolmentsService.update(+id, updateEnrolmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrolmentsService.remove(+id);
  }
}
