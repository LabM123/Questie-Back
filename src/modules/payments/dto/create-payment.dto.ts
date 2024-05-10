import { IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsString()
  @IsUUID()
  productId: string;
}
