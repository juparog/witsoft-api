import { registerAs } from '@nestjs/config';
import { configNamespaces } from './consts.config';

export default registerAs(configNamespaces.DB, () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT)
}));
