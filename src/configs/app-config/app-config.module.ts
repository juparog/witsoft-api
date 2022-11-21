import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appFeature from './app-config.feature';
import { AppConfigService } from './app-config.service';

@Module({
  imports: [ConfigModule.forFeature(appFeature)],
  exports: [AppConfigService],
  providers: [AppConfigService]
})
export class AppConfigModule {}
