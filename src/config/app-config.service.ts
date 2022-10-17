import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';

import { ValidatedConfigService } from './validated-config.service';

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

  @IsInt()
  @IsPositive()
  @IsOptional()
  get port(): number {
    return this.configService.get<number>('app.port');
  }
}
