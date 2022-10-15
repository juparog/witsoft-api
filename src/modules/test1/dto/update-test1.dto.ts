import { PartialType } from '@nestjs/mapped-types';
import { CreateTest1Dto } from './create-test1.dto';

export class UpdateTest1Dto extends PartialType(CreateTest1Dto) {}
