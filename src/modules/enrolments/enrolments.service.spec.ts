import { Test, TestingModule } from '@nestjs/testing';
import { EnrolmentsService } from './enrolments.service';

describe('EnrolmentsService', () => {
  let service: EnrolmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrolmentsService],
    }).compile();

    service = module.get<EnrolmentsService>(EnrolmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
