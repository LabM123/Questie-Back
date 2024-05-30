import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Status } from 'src/helpers/status.enum';

export class CreateCourseDto {
  @ApiProperty({
    example: 'Introduccion a la programacion con python',
    description: 'The title of the course that is being created',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(5)
  title: string;

  @ApiProperty({
    example: 'This course covers the basics of Python programming.',
    description: 'The headline of the course that is being created',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  headline: string;

  @ApiProperty({
    example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: 'The description of the course that is being created',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: '"pending" or "complete".',
    description: 'The status of the course that is being created or updated',
  })
  @IsOptional()
  @IsString()
  status: Status;

  @ApiProperty({
    example: '"true" or "false".',
    description:
      'the definition of whether the course is going to be a product or not',
  })
  @IsOptional()
  @IsBoolean()
  isProduct: boolean;

  @IsOptional()
  @IsArray()
  categories: string[];
}
