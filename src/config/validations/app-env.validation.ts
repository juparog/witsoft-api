import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, validateSync, IsOptional } from 'class-validator';

enum Environment {
  Development = 'development',
  Test = 'test',
  Production = 'production'
}

export class AppEnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @IsOptional()
  PORT?: number;
}
