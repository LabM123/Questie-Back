import { Test, TestingModule } from '@nestjs/testing';
import { UploadfileController } from './uploadfile.controller';
import { UploadfileService } from './uploadfile.service';

describe('UploadfileController', () => {
  let controller: UploadfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadfileController],
      providers: [UploadfileService],
    }).compile();

    controller = module.get<UploadfileController>(UploadfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
