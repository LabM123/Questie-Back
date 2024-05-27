import {
  Body,
  Controller,
  // Get,
  // ParseUUIDPipe,
  Post,
  //Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Request } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @Post('/paypal')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  async payWithPaypal(@Body() createPaymentDto: CreatePaymentDto) {
    const approvalUrl =
      await this.paymentsService.payWithPaypal(createPaymentDto);
    return approvalUrl;
  }

  // @ApiBearerAuth()
  // @Get('/paypal/success')
  // @Roles(Role.admin, Role.user)
  // @UseGuards(AuthGuard, RolesGuard)
  // async paypalSuccess(
  //   @Query('paymentId', ParseUUIDPipe) paymentId: string,
  //   @Query('PayerID', ParseUUIDPipe) PayerID: string,
  // ) {
  //   return { paymentId, PayerID };
  // }

  @ApiBearerAuth()
  @Post('/mercado-pago')
  @UseGuards(AuthGuard)
  async payWithMercadoPago(@Req() request: Request) {
    return this.paymentsService.payWithMercadoPago(request);
  }

  @ApiBearerAuth()
  @Post('/coins')
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  async payWithCoins(@Body() createPaymentDto: CreatePaymentDto) {
    const invoiceId = await this.paymentsService.payWithCoins(createPaymentDto);
    return invoiceId;
  }

  // @ApiBearerAuth()
  // @Get('/success')
  // @Roles(Role.admin, Role.user)
  // @UseGuards(AuthGuard, RolesGuard)
  // async success(@Query('invoiceId', ParseUUIDPipe) invoiceId: string) {
  //   return await this.paymentsService.success(invoiceId);
  // }
}
