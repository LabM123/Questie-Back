import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssessmentDto {
  @ApiProperty({
    description: 'Puntuación de la evaluación, debe estar entre 1 y 5',
    example: 4,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  score: number;

  @ApiProperty({
    description: 'ID del usuario que realiza la evaluación',
    example: 'a723144e-1988-4f39-b6c1-5078949b8ae8',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'ID del curso al que pertenece la evaluación',
    example: '1dbe0b43-87ea-4955-8903-eb4600456659',
  })
  @IsString()
  @IsNotEmpty()
  courseId: string;
}
