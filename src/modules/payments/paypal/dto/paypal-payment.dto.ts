import { IsString, IsUUID } from 'class-validator';

export class PaypalPaymentDto {
  @IsString()
  @IsUUID()
  product_id: string;
}
