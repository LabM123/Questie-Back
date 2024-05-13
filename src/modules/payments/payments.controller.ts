import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Post,
  Query,
  Redirect,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @Post('/paypal')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  @Redirect()
  async payWithPaypal(@Body() createPaymentDto: CreatePaymentDto) {
    const approvalUrl =
      await this.paymentsService.payWithPaypal(createPaymentDto);
    return { url: approvalUrl };
  }

  @ApiBearerAuth()
  @Get('/paypal/success')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  async paypalSuccess(
    @Query('paymentId', ParseUUIDPipe) paymentId: string,
    @Query('PayerID', ParseUUIDPipe) PayerID: string,
  ) {
    return { paymentId, PayerID };
  }

  @ApiBearerAuth()
  @Post('/mercado-pago')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  async payWithMercadoPago(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.payWithMercadoPago(createPaymentDto);
  }

  @ApiBearerAuth()
  @Post('/coins')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  @Redirect('http://localhost:3000/payments/success', 302)
  async payWithCoins(@Body() createPaymentDto: CreatePaymentDto) {
    const invoiceId = await this.paymentsService.payWithCoins(createPaymentDto);
    return { invoiceId };
  }

  @ApiBearerAuth()
  @Get('/success')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  @Redirect()
  async success(@Query('invoiceId', ParseUUIDPipe) invoiceId: string) {
    const paidInvoiceId = await this.paymentsService.success(invoiceId);
    return { url: `http://localhost:3000/invoices/${paidInvoiceId}` };
  }
}
