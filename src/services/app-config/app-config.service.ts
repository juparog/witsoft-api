import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';

import { ValidatedConfigService } from '@witsoft/services/utils/validated-config.service';

enum Environment {
  Development = 'development',
  Production = 'production'
}

@Injectable()
export class AppConfigService extends ValidatedConfigService {
  constructor(private configService: ConfigService) {
    super();
  }

  @IsEnum(Environment)
  get nodeEnv(): string {
    return this.configService.get<string>('app.nodeEnv');
  }

  @IsString()
  @IsOptional()
  get host(): string {
    return this.configService.get<string>('app.host');
  }

  @IsInt()
  @IsPositive()
  @IsOptional()
  get port(): number {
    return this.configService.get<number>('app.port');
  }
}
