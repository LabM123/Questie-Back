import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadfileService } from './uploadfile.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('uploadfile')
export class UploadfileController {
  constructor(private readonly uploadfileService: UploadfileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 104857600, //100MB
            message: 'File size must be less than 100MB'
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|svg|mp4|mp3)/
          })
        ]
      })
    ) file: Express.Multer.File
  ){
    return this.uploadfileService.uploadFile(file);
  }
}
