import { PartialType } from '@nestjs/swagger';
import { CreateSearchDto } from './create-search.dto';

export class UpdateSearchDto extends PartialType(CreateSearchDto) {}
