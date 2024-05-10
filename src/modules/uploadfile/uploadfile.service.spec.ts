import { Test, TestingModule } from '@nestjs/testing';
import { UploadfileService } from './uploadfile.service';

describe('UploadfileService', () => {
  let service: UploadfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadfileService],
    }).compile();

    service = module.get<UploadfileService>(UploadfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
