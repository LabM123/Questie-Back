import { IsUUID } from 'class-validator';

export class CreateEnrolmentDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  courseId: string;
}
