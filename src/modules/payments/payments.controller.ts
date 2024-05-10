import { Body, Controller, Get, Post, Query, Redirect } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/paypal')
  @Redirect()
  async payWithPaypal(@Body() createPaymentDto: CreatePaymentDto) {
    const approvalUrl =
      await this.paymentsService.payWithPaypal(createPaymentDto);
    return { url: approvalUrl };
  }

  @Get('/paypal/success')
  async paypalSuccess(
    @Query('paymentId') paymentId: string,
    @Query('PayerID') PayerID: string,
  ) {
    return { paymentId, PayerID };
  }

  @Post('/mercado-pago')
  async payWithMercadoPago(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.payWithMercadoPago(createPaymentDto);
  }

  @Post('/coins')
  async payWithCoins(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.payWithCoins(createPaymentDto);
  }

  @Get('/success')
  @Redirect()
  async success() {
    await this.paymentsService.success(); //Logica de inscripción a curso o actualización de "stats" de usuario
    return { url: 'http://localhost:3000/invoices' };
  }
}
