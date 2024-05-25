import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Programacion',
    description: 'The category that the course will have',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(10)
  name: string;

  @ApiProperty({
    example: 'www.img.com',
    description: 'The image of the category',
  })
  @IsOptional()
  @IsString()
  image: string;
}
