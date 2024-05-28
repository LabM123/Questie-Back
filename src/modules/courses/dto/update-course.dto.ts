import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';
// import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Status } from 'src/helpers/status.enum';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
    // @ApiProperty({
    //     example: 'Introduccion a la programacion con python',
    //     description: 'The title of the course that is being created',
    //   })
      @IsOptional()
      @IsString()
      @MaxLength(50)
      @MinLength(5)
      title: string;
    
      // @ApiProperty({
      //   example: 'This course covers the basics of Python programming.',
      //   description: 'The headline of the course that is being created',
      // })
      @IsOptional()
      @IsString()
      @MaxLength(255)
      headline: string;
    
      // @ApiProperty({
      //   example: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      //   description: 'The description of the course that is being created',
      // })
      @IsOptional()
      @IsString()
      description: string;
    
      // @ApiProperty({
      //   example: '"pending" or "complete".',
      //   description: 'The status of the course that is being created or updated',
      // })
      @IsOptional()
      @IsString()
      status: Status;
    
      // @ApiProperty({
      //   example: '"true" or "false".',
      //   description:
      //     'the definition of whether the course is going to be a product or not',
      // })
      @IsOptional()
      @IsBoolean()
      isProduct: boolean;
}
