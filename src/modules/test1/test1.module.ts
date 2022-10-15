import { Module } from '@nestjs/common';
import { Test1Service } from './test1.service';
import { Test1Controller } from './test1.controller';
import { ConfigModule } from '@nestjs/config';

import appConfig from '@/config/app.config';

@Module({
  imports: [ConfigModule.forFeature(appConfig)],
  controllers: [Test1Controller],
  providers: [Test1Service]
})
export class Test1Module {}
