import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPositive,
  IsUUID,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { PolymorphicEntityType } from '../entities/product.entity';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
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

  @IsString()
  @IsOptional()
  imgUrl: string;
  
  @IsNotEmpty()
  @IsNumber()
  order: number;

  @IsUUID()
  @IsOptional()
  polymorphicEntityId: string;

  @IsString()
  @IsEnum(PolymorphicEntityType)
  @IsOptional()
  polymorphicEntityType: string;
}
