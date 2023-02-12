import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { ValidatedConfigService } from "@witsoft/config/validated-config.service";

enum LoggerLevel {
	ERROR = "error",
	WARN = "warn",
	INFO = "info",
	DEBUG = "debug",
}

enum FormatUri {
	mongodb = "mongodb",
	mongodbSvr = "mongodb+srv",
}

@Injectable()
export class DbConfigService extends ValidatedConfigService {
	constructor(private configService: ConfigService) {
		super();
	}

	// [mongodb|mongodb+srv]://[dbusername:dbpassword@]dbhost1[:dbport1][,...dbhostN[:dbportN]][/[defaultauthdb][?options]]
	get mongoUri(): string {
		const credentials = this.user ? `${this.user}:${this.password}@` : "";
		const defaultauthdb = this.name ? `/${this.name}` : "";
		const options = this.options ? `?${this.options}` : "";

		return `${this.formatUri}://${credentials}${this.host}:${this.port}${defaultauthdb}${options}`;
	}

	@IsOptional()
	@IsString()
	get name(): string {
		return this.configService.get<string>("db.name");
	}

	@IsOptional()
	@IsString()
	get user(): string {
		return this.configService.get<string>("db.user");
	}

	@IsOptional()
	@IsString()
	get password(): string {
		return this.configService.get<string>("db.password");
	}

	@IsString()
	get host(): string {
		return this.configService.get<string>("db.host");
	}

	@IsNumber()
	get port(): string {
		return this.configService.get<string>("db.port");
	}

	@IsOptional()
	@IsEnum(FormatUri)
	get formatUri(): string {
		return this.configService.get<string>("db.formatUri");
	}

	@IsOptional()
	@IsString()
	get options(): string {
		return this.configService.get<string>("db.options");
	}

	@IsEnum(LoggerLevel)
	get loggerLevel(): LoggerLevel {
		return this.configService.get<LoggerLevel>("db.loggerLevel");
	}
}
