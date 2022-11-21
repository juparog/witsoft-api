import { Injectable } from '@nestjs/common';

import { AppConfigService } from '@witsoft/config/app-config/app-config.service';

import { CreateTest1Dto } from './dto/create-test1.dto';
import { UpdateTest1Dto } from './dto/update-test1.dto';

@Injectable()
export class Test1Service {
  constructor(private readonly appConfigService: AppConfigService) {}

  create(createTest1Dto: CreateTest1Dto) {
    return 'This action adds a new test1';
  }

  findAll() {
    console.log(this.appConfigService.nodeEnv);
    console.log(this.appConfigService.port);
    return `This action returns all test1`;
  }

  findOne(id: number) {
    return `This action returns a #${id} test1`;
  }

  update(id: number, updateTest1Dto: UpdateTest1Dto) {
    return `This action updates a #${id} test1`;
  }

  remove(id: number) {
    return `This action removes a #${id} test1`;
  }
}
