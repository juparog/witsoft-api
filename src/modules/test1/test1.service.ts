import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateTest1Dto } from './dto/create-test1.dto';
import { UpdateTest1Dto } from './dto/update-test1.dto';

@Injectable()
export class Test1Service {
  constructor(private readonly configService: ConfigService) {}

  create(createTest1Dto: CreateTest1Dto) {
    return 'This action adds a new test1';
  }

  findAll() {
    console.log(this.configService.get<number>('app.port'));
    console.log(this.configService.get<number>('db.port'));
    console.log(this.configService.get<number>('PORT'));
    console.log(this.configService.get<number>('TEST', { infer: true }));

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
