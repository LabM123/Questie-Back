import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsUUID,
  IsOptional,
  Length,
  IsEnum,
} from 'class-validator';
import { PolymorphicEntityType } from '../entities/product.entity';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsUUID()
  @IsOptional()
  polymorphicEntityId: string;

  @IsString()
  @IsEnum(PolymorphicEntityType)
  @IsOptional()
  polymorphicEntityType: string;
}
