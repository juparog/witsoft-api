import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IsEnum, IsString } from 'class-validator';
import { ValidatedConfigService } from '@witsoft/config/validated-config.service';
import { LoggerLevel } from './db-config.types';


@Injectable()
export class DbConfigService extends ValidatedConfigService {
  constructor(private configService: ConfigService) {
    super();
  }

  @IsString()
  get mongoUri(): string {
    return this.configService.get<string>('db.mongoUri');
  }

  @IsEnum(LoggerLevel)
  get loggerLevel(): LoggerLevel {
    return this.configService.get<LoggerLevel>('db.loggerLevel');
  }
}
