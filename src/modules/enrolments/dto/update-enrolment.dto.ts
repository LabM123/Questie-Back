import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrolmentDto } from './create-enrolment.dto';

export class UpdateEnrolmentDto extends PartialType(CreateEnrolmentDto) {}
