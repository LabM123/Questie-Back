import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateProgressDto {
  @ApiProperty({ description: 'User ID', example: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Lesson ID', example: 'uuid' })
  @IsUUID()
  lessonId: string;
}
