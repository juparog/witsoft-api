import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";
import { RequestContextModule } from "nestjs-request-context";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseUniqueValidator from "mongoose-unique-validator";
import mongooseValidationErrorTransform from "mongoose-validation-error-transform";
import "reflect-metadata";

import { OrganizationModule } from "@witsoft/modules/organization/organization.module";
import { DbConfigModule } from "@witsoft/config/db-config/db-config.module";
import { DbConfigService } from "@witsoft/config/db-config/db-config.service";
import { ContextInterceptor } from "@witsoft/libs/application/context/ContextInterceptor";
import { ExceptionInterceptor } from "@witsoft/libs/application/interceptors/exception.interceptor";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppConfigModule } from "./configs/app-config/app-config.module";

const interceptors = [
	{
		provide: APP_INTERCEPTOR,
		useClass: ContextInterceptor,
	},
	{
		provide: APP_INTERCEPTOR,
		useClass: ExceptionInterceptor,
	},
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      expandVariables: true,
    }),
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [DbConfigModule],
      useFactory: (dbConfig: DbConfigService) => {
        return <MongooseModuleOptions>{
          uri: dbConfig.mongoUri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          ignoreUndefined: true,
          connectionFactory: (connection) => {
            connection.plugin(mongoosePaginate);
            connection.plugin(mongooseUniqueValidator);
            connection.plugin(mongooseValidationErrorTransform, {
              transform: function(messages: string[]) {
                return messages.join('||');
              }
            });
            return connection;
          },
          loggerLevel: dbConfig.loggerLevel,
        };
      },
      inject: [DbConfigService],
    }),
    EventEmitterModule.forRoot(),
    RequestContextModule,
    OrganizationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ...interceptors
  ],
})
export class AppModule {}
