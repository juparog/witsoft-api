import { registerAs } from '@nestjs/config';

import { configNamespaces } from './consts.config';
import { AppEnvInterface } from './interfaces/app-env.interface';
import { AppEnvironmentVariables } from './validations/app-env.validation';
import { validateUtil } from './validate-util';

export default registerAs(configNamespaces.APP, (): AppEnvInterface => {
  const test = validateUtil(process.env, AppEnvironmentVariables);
  console.log(test);

  return {
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.PORT)
  };
});
