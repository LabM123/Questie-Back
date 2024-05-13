import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
export class CreateLessonDto {
  @ApiProperty({
    example: 'Lesson 1',
    description: 'The title of the lesson',
  })
  @IsNotEmpty()
  title: string;

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
    example: 1,
    description: 'The experience points that the lesson will give the user.',
  })
  @IsNotEmpty()
  @IsNumber()
  xp: number;

  @ApiProperty({
    example: 1,
    description: 'The coins that the lesson will give the user.',
  })
  @IsNotEmpty()
  @IsNumber()
  coins: number;
}
