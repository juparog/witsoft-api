import { Injectable } from '@nestjs/common';
import { CreateTest2Dto } from './dto/create-test2.dto';
import { UpdateTest2Dto } from './dto/update-test2.dto';
import { ConfigService, ConfigType } from '@nestjs/config';

import dbConfig from '@/config/db.config';
import { Inject } from '@nestjs/common';

@Injectable()
export class Test2Service {
  constructor(
    @Inject(dbConfig.KEY)
    private databaseConfig: ConfigType<typeof dbConfig>
  ) {}

  create(createTest2Dto: CreateTest2Dto) {
    return 'This action adds a new test2';
  }

  findAll() {
    console.log(this.databaseConfig.port);
    return `This action returns all test2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} test2`;
  }

  update(id: number, updateTest2Dto: UpdateTest2Dto) {
    return `This action updates a #${id} test2`;
  }

  remove(id: number) {
    return `This action removes a #${id} test2`;
  }
}
