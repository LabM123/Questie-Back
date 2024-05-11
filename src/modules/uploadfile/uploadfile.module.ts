import { Module } from '@nestjs/common';
import { UploadfileService } from './uploadfile.service';
import { UploadfileController } from './uploadfile.controller';
import { FileUploadHelper } from './helpers/fileUploadHelper';
import { CloudinaryConfig } from 'src/config/cloudinary';

@Module({
  controllers: [UploadfileController],
  providers: [UploadfileService, FileUploadHelper, CloudinaryConfig],
  exports: [UploadfileService],
})
export class UploadfileModule {}
