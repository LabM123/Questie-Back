import { Test, TestingModule } from '@nestjs/testing';
import { EnrolmentsController } from './enrolments.controller';
import { EnrolmentsService } from './enrolments.service';

describe('EnrolmentsController', () => {
  let controller: EnrolmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrolmentsController],
      providers: [EnrolmentsService],
    }).compile();

    controller = module.get<EnrolmentsController>(EnrolmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
