import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { ValidatedConfigService } from '@witsoft/services/utils/validated-config.service';

@Injectable()
export class DbConfigService extends ValidatedConfigService {
  constructor(private configService: ConfigService) {
    super();
  }

  @IsString()
  @IsOptional()
  get host(): string {
    return this.configService.get<string>('db.host');
  }

  @IsInt()
  @IsPositive()
  @IsOptional()
  get port(): number {
    return this.configService.get<number>('db.port');
  }
}
