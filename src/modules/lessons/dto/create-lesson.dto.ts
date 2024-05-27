import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({
    example: 'Lesson 1',
    description: 'The title of the lesson',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'd4f5c5e8-d2e8-4fc7-a3f5-11f4d2a6e6c1',
    description: 'The UUID of the module this lesson belongs to',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  module_id: string;

  @ApiProperty({
    example: 1,
    description: 'The order that the lesson will have within the module',
  })
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty({
    example: 100,
    description: 'The experience points that the lesson will give the user.',
  })
  @IsNotEmpty()
  @IsNumber()
  xp: number;

  @ApiProperty({
    example: 50,
    description: 'The coins that the lesson will give the user.',
  })
  @IsNotEmpty()
  @IsNumber()
  coins: number;
}
