import { PartialType } from '@nestjs/mapped-types';
import { CreateTest2Dto } from './create-test2.dto';

export class UpdateTest2Dto extends PartialType(CreateTest2Dto) {}
