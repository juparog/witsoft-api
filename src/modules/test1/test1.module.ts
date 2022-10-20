import { Module } from '@nestjs/common';
import { Test1Service } from './test1.service';
import { Test1Controller } from './test1.controller';
import { ConfigModule } from '@nestjs/config';

import appFeature from 'src/services/config/app-config.feature';
import { AppConfigService } from 'src/services/config/app-config.service';

@Module({
  imports: [ConfigModule.forFeature(appFeature)],
  controllers: [Test1Controller],
  providers: [Test1Service, AppConfigService]
})
export class Test1Module {}
