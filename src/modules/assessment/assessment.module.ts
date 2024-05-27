import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'mercadopago';
import { Course } from '../courses/entities/course.entity';
import { Assessment } from './entities/assessment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Assessment, User, Course])],
  controllers: [AssessmentController],
  providers: [AssessmentService],
})
export class AssessmentModule {}
