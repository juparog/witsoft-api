import { Injectable } from '@nestjs/common';
import Convict from 'convict';
import * as dotenv from 'dotenv';

import { Schema, TConfigSchema } from './config.schema';

@Injectable()
export class ConfigService {
  private config: Convict.Config<TConfigSchema>;
  constructor() {
    this.config = Convict(Schema);

    const dotEnvFile = dotenv.config().parsed;
    if (dotEnvFile) {
      this.config.load(dotenv.config().parsed);
    }
    this.config.validate({ allowed: 'warn' });
  }

  get(key: keyof TConfigSchema): any {
    return this.config.get(key);
  }

  get port(): number {
    return this.config.get('PORT');
  }
}
