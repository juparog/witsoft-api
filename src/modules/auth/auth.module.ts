import { Logger, Module, Provider } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { OrganizationModule } from "@witsoft/modules/organization/organization.module";
import { AppConfigModule } from "@witsoft/config/app-config/app-config.module";
import { AppConfigService } from "@witsoft/config/app-config/app-config.service";

import { LoginOrganizationHttpController } from "./commands/login-organization/login-organization.htpp.controller";
import { ValidateOrganizationQueryHandler } from "./queries/validate-organization/validate-organizations.query-handler";
import { LocalStrategy } from "./strategies/local.strategy";
import { LoginOrganizationService } from "./commands/login-organization/login-organization.service";
import { JwtStrategy } from "./strategies/jwt.strategy";

const httpControllers = [LoginOrganizationHttpController];

const commandHandlers: Provider[] = [LoginOrganizationService];

const queryHandlers: Provider[] = [ValidateOrganizationQueryHandler];

@Module({
	imports: [
    AppConfigModule,
    CqrsModule,
    OrganizationModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      useFactory: (appConfig: AppConfigService) => {
          return {
            secret: appConfig.jwtSecretKey,
            signOptions: {
              expiresIn: appConfig.jwtExpirationTime,
            },
          };
        },
        inject: [AppConfigService],
      }),
    ],
  controllers: [...httpControllers],
	providers: [
    Logger,
    LocalStrategy,
    JwtStrategy,
    ...queryHandlers,
    ...commandHandlers
  ],
})
export class AuthModule {}
