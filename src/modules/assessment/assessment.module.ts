import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';

@Module({
  controllers: [AssessmentController],
  providers: [AssessmentService],
})
export class AssessmentModule {}
