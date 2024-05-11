import { BadRequestException, Injectable } from '@nestjs/common';
import { FileUploadHelper } from './helpers/fileUploadHelper';

@Injectable()
export class UploadfileService {
  constructor(private readonly fileUploadHelper: FileUploadHelper) {}

  async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    try {
      const uploadedFile: any = await this.fileUploadHelper.uploadImage(file);
      return { url: uploadedFile.secure_url };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
