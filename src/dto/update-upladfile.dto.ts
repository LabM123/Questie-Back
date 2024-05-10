import { PartialType } from '@nestjs/swagger';
import { CreateUpladfileDto } from './create-upladfile.dto';

export class UpdateUpladfileDto extends PartialType(CreateUpladfileDto) {}
