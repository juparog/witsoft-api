import { Module } from '@nestjs/common';
import { Test2Service } from './test2.service';
import { Test2Controller } from './test2.controller';
import { ConfigModule } from '@nestjs/config';

import dbConfig from '@/config/db.config';

@Module({
  imports: [ConfigModule.forFeature(dbConfig)],
  controllers: [Test2Controller],
  providers: [Test2Service]
})
export class Test2Module {}
