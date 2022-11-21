import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import dbFeature from './db-config.feature';
import { DbConfigService } from './db-config.service';

@Module({
  imports: [ConfigModule.forFeature(dbFeature)],
  exports: [DbConfigService],
  providers: [DbConfigService]
})
export class DbConfigModule {}
