import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
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
import { Request } from 'express';
import { Preference } from 'mercadopago';
import { client } from 'src/config/mercadopago';

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

  async payWithMercadoPago(request: Request){
    try {
      // const idempotencyKey = request.headers['x-idempotency-key'];
      const body = {
        items: [
          {
            id: request.body.product_id,
            title: request.body.title,
            quantity: Number(request.body.quantity),
            unit_price: Number(request.body.unit_price),
            currency_id: 'MXN'
          }
        ],
        back_urls: {
          success: process.env.MERCADOPAGO_SUCCESS_URI,
          failure: process.env.MERCADOPAGO_FAILURE_URI,
          pending: process.env.MERCADOPAGO_PENDING_URI
        },
        auto_return: 'approved'
      }
      const preference = new Preference(client);
      const result = await preference.create({body})
      return {id: result.id}
      // const response = await axios.post('https://api.mercadopago.com/checkout/preferences', body, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      //     'x-idempotency-key': idempotencyKey
      //   }
      // })
      // return { id: response.data.id }
    } catch (error:any) {
      throw new BadRequestException(error.message)
    }
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

    const invoiceId = this.invoicesService.createInvoice({userId, productId});

    return invoiceId;
  }

  async success(invoiceId: string) {
    const paidInvoiceId =
      await this.invoicesService.updateToCompleted(invoiceId);

    return paidInvoiceId;
  }
}
