import { PartialType } from '@nestjs/swagger';
import { CreateUploadfileDto } from './create-uploadfile.dto';

export class UpdateUploadfileDto extends PartialType(CreateUploadfileDto) {}
