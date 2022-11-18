import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { OrganizationModule } from '@witsoft/modules/organization/organization.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Test1Module } from './modules/test1/test1.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env']
    }),
    Test1Module,
    OrganizationModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
