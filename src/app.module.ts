import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { RequestContextModule } from 'nestjs-request-context';

import { OrganizationModule } from '@witsoft/modules/organization/organization.module';
import { DbConfigModule } from '@witsoft/config/db-config/db-config.module';
import { DbConfigService } from '@witsoft/config/db-config/db-config.service';
import { ContextInterceptor } from '@witsoft/libs/application/context/ContextInterceptor';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Test1Module } from './modules/test1/test1.module';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ContextInterceptor,
  }
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env']
    }),
    MongooseModule.forRootAsync({
      imports: [DbConfigModule],
      useFactory: (dbConfig: DbConfigService) => {
        return <MongooseModuleOptions>{
          uri: dbConfig.mongoUri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          loggerLevel: dbConfig.loggerLevel,
        };
      },
      inject: [DbConfigService],
    }),
    EventEmitterModule.forRoot(),
    RequestContextModule,
    Test1Module,
    OrganizationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...interceptors
  ],
})
export class AppModule {}
