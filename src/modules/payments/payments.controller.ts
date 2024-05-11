import { Body, Controller, Get, ParseUUIDPipe, Post, Query, Redirect } from '@nestjs/common';
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
    @Query('paymentId', ParseUUIDPipe) paymentId: string,
    @Query('PayerID', ParseUUIDPipe) PayerID: string,
  ) {
    return { paymentId, PayerID };
  }

  @Post('/mercado-pago')
  async payWithMercadoPago(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.payWithMercadoPago(createPaymentDto);
  }

  @Post('/coins')
  @Redirect('http://localhost:3000/payments/success', 302)
  async payWithCoins(@Body() createPaymentDto: CreatePaymentDto) {
    const invoiceId = await this.paymentsService.payWithCoins(createPaymentDto);
    return { invoiceId };
  }

  @Get('/success')
  @Redirect()
  async success(@Query('invoiceId', ParseUUIDPipe) invoiceId: string) {
    const paidInvoiceId = await this.paymentsService.success(invoiceId);
    return { url: `http://localhost:3000/invoices/${paidInvoiceId}` };
  }
}
