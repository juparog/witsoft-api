import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
	IsEnum,
	IsInt,
	IsOptional,
	IsPositive,
	IsString,
} from "class-validator";

import { ValidatedConfigService } from "../validated-config.service";

enum Environment {
	Development = "development",
	Production = "production",
}

@Injectable()
export class AppConfigService extends ValidatedConfigService {
	constructor(private configService: ConfigService) {
		super();
	}

	@IsEnum(Environment)
	get nodeEnv(): string {
		return this.configService.get<string>("app.nodeEnv");
	}

	@IsString()
  @IsOptional()
	get host(): string {
		return this.configService.get<string>("app.host");
	}

	@IsInt()
  @IsPositive()
  @IsOptional()
	get port(): number {
		return this.configService.get<number>("app.port");
	}

	@IsString()
  @IsOptional()
	get apiName(): string {
		return this.configService.get<string>("app.apiName");
	}

	@IsString()
  @IsOptional()
	get apiDescription(): string {
		return this.configService.get<string>("app.apiDescription");
	}

	@IsString()
  @IsOptional()
	get apiVersion(): string {
		return this.configService.get<string>("app.apiVersion");
	}

	@IsString()
  @IsOptional()
	get apiPrefix(): string {
		return this.configService.get<string>("app.apiPrefix");
	}

	@IsString()
  @IsOptional()
	get jwtSecretKey(): string {
		return this.configService.get<string>("app.jwtSecretKey");
	}

	@IsString()
  @IsOptional()
	get jwtExpirationTime(): string {
		return this.configService.get<string>("app.jwtExpirationTime");
	}
}
