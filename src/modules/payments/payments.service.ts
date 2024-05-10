import { Inject, Injectable } from '@nestjs/common';
import { PaypalService } from './paypal/paypal.service';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(PaypalService) private readonly paypalService: PaypalService,
  ) {}

  async payWithMercadoPago({
    userId,
    productId,
  }: {
    userId: string;
    productId: string;
  }) {
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
  }

  async success() {
    throw new Error('Method not implemented.');
  }
}
