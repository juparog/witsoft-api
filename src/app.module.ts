import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Test1Module } from './modules/test1/test1.module';
import { Test2Module } from './modules/test2/test2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env']
    }),
    Test1Module,
    Test2Module
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
