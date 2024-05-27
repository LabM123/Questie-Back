import { Module } from '@nestjs/common';
import { EnrolmentsService } from './enrolments.service';
import { EnrolmentsController } from './enrolments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrolment } from './entities/enrolment.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Product } from '../products/entities/product.entity';
import { Stats } from '../stats/entities/stats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enrolment, User, Course, Product, Stats])],
  controllers: [EnrolmentsController],
  providers: [EnrolmentsService],
})
export class EnrolmentsModule {}
