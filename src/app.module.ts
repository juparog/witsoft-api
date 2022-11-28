import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

import { OrganizationModule } from '@witsoft/modules/organization/organization.module';
import { RequestContextModule } from 'nestjs-request-context';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Test1Module } from './modules/test1/test1.module';
import { DbConfigModule } from './configs/db-config/db-config.module';
import { DbConfigService } from './configs/db-config/db-config.service';

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
          useFindAndModify: false,
          loggerLevel: dbConfig.loggerLevel,
        };
      },
      inject: [DbConfigModule],
    }),
		EventEmitterModule.forRoot(),
		RequestContextModule,
    Test1Module,
    OrganizationModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
