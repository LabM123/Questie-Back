import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({
    example: 'Module 1',
    description: 'The title of the module',
  })
  @IsNotEmpty({ message: 'Title must not be empty' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({
    example: 'Module description',
    description: 'The module description',
  })
  @IsNotEmpty({ message: 'Description must not be empty' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({
    example: 'c1e9f0e0-6b9f-4e6d-8d6e-4c7e2e7e7f6d',
    description: 'The course id that the module will be linked to',
  })
  @IsNotEmpty({ message: 'Course ID must not be empty' })
  @IsString({ message: 'Course ID must be a string' })
  @IsUUID('4', { message: 'Invalid course ID format' })
  course_id: string;
}
