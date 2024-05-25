import { PartialType } from '@nestjs/mapped-types';
import { CreateAuth0Dto } from './create-auth0.dto';

export class UpdateAuth0Dto extends PartialType(CreateAuth0Dto) {}
