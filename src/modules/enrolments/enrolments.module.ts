import { Module } from '@nestjs/common';
import { EnrolmentsService } from './enrolments.service';
import { EnrolmentsController } from './enrolments.controller';

@Module({
  controllers: [EnrolmentsController],
  providers: [EnrolmentsService],
})
export class EnrolmentsModule {}
