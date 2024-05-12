import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaypalService } from './paypal/paypal.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { Enrolment } from '../enrolments/entities/enrolment.entity';
import { InvoicesService } from '../invoices/invoices.service';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PaypalService) private readonly paypalService: PaypalService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Enrolment)
    private readonly enrolmentRepository: Repository<Enrolment>,
    @Inject(InvoicesService)
    private readonly invoicesService: InvoicesService,
  ) {}

  async payWithMercadoPago({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) {
    throw new InternalServerErrorException('Method not implemented.');
  }

  async payWithPaypal({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) {
    return await this.paypalService.createPayment({ product_id: productId });
  }

  async payWithCoins({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['stats', 'enrolments'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const course = await this.courseRepository.findOne({
      where: { id: product.polymorphicEntityId },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const enrolmentExists = user.enrolments.find(
      async (enrolment) => enrolment.course.id === course.id,
    );
    if (enrolmentExists) {
      throw new ConflictException('User is already enrolled in this course');
    }

    if (user.stats.coins < product.price) {
      throw new ForbiddenException('Not enough coins');
    }

    user.stats.coins -= product.price;
    await this.userRepository.save(user);

    await this.enrolmentRepository.save(
      this.enrolmentRepository.create({
        user,
        course,
      }),
    );

    const invoiceId = this.invoicesService.createInvoice(userId, productId);

    return invoiceId;
  }

  async success(invoiceId: string) {
    const paidInvoiceId =
      await this.invoicesService.updateToCompleted(invoiceId);

    return paidInvoiceId;
  }
}
