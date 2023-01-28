import { Module } from '@nestjs/common';

import { AppConfigModule } from '@witsoft/config/app-config/app-config.module';

import { Test1Controller } from './test1.controller';
import { Test1Service } from './test1.service';

@Module({
  imports: [AppConfigModule],
  controllers: [Test1Controller],
  providers: [Test1Service]
})
export class Test1Module {}
