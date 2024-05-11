import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({
    example: 'Module 1',
    description: 'The title of the module',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'c1e9f0e0-6b9f-4e6d-8d6e-4c7e2e7e7f6d',
    description: 'The course id that the module will be linked to',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  course_id: string;
}
