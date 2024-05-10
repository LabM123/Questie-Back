import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaypalService } from './paypal/paypal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Course } from '../courses/entities/course.entity';
import { Enrolment } from '../enrolments/entities/enrolment.entity';
import { InvoicesService } from '../invoices/invoices.service';
import { User } from '../users/entities/user.entity';
import { Invoice } from '../invoices/entities/invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Course, Enrolment, User, Invoice]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaypalService, InvoicesService],
})
export class PaymentsModule {}
