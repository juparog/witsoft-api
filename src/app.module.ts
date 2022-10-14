import { Module } from '@nestjs/common';

import { ConfigModule } from '@/modules/config/config.module';
import { ConfigService } from '@/modules/config/config.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService, ConfigService]
})
export class AppModule {}
