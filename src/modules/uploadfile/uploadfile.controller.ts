import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadfileService } from './uploadfile.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/decorators/roles.enum';
import { RolesGuard } from '../auth/guard/roles.guard';

@ApiTags('Upload File')
@Controller('uploadfile')
export class UploadfileController {
  constructor(private readonly uploadfileService: UploadfileService) {}

  @ApiBearerAuth()
  @Post()
  @Roles(Role.admin, Role.user)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 104857600, //100MB
            message: 'File size must be less than 100MB',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|svg|mp4|mp3)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadfileService.uploadFile(file);
  }
}
