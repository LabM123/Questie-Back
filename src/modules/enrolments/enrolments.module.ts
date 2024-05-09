import { Module } from '@nestjs/common';
import { EnrolmentsService } from './enrolments.service';
import { EnrolmentsController } from './enrolments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrolment, User, Course])],
  controllers: [EnrolmentsController],
  providers: [EnrolmentsService],
})
export class EnrolmentsModule {}
