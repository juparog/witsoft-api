import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  host: process.env.HOST,
  port: parseInt(process.env.PORT)
}));
