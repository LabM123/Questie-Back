import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as paypal from 'paypal-rest-sdk';
import { Product } from 'src/modules/products/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaypalService {
  constructor(
    @InjectRepository(Product) private productService: Repository<Product>,
  ) {
    paypal.configure({
      mode: 'sandbox', // 'sandbox' or 'live'
      client_id: process.env.PAYPAL_CLIENT_ID,
      client_secret: process.env.PAYPAL_SECRET,
    });
  }

  async createPayment({ product_id }: { product_id: string }) {
    // Get product details from the database
    const product = await this.productService.findOne({
      where: { id: product_id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${process.env.APP_URL}/shop/payments/paypal/success`,
        cancel_url: `${process.env.APP_URL}/shop/payments/paypal/cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: product.name,
                sku: product.id,
                price: Number(product.price).toFixed(2),
                currency: product.currency,
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: Number(product.price).toFixed(2),
          },
          description: product.description,
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(
        payment,
        (error: any, payment: { links: any[] }) => {
          if (error) {
            reject(error);
          } else {
            resolve(
              payment.links.find(
                (link: { rel: string }) => link.rel === 'approval_url',
              ).href,
            );
          }
        },
      );
    });
  }

  async executePayment(paymentId: string, PayerID: string) {
    const execute_payment_json = {
      payer_id: PayerID,
    };

    return new Promise((resolve, reject) => {
      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        (error: any, payment: unknown) => {
          if (error) {
            reject(error);
          } else {
            resolve(payment);
          }
        },
      );
    });
  }
}
