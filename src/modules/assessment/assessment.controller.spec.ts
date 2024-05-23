import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';

describe('AssessmentController', () => {
  let controller: AssessmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentController],
      providers: [AssessmentService],
    }).compile();

    controller = module.get<AssessmentController>(AssessmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
