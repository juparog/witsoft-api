import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  mongoUri: process.env.DB_MONGOURI,
  loggerLevel: process.env.DB_LOGGER_LEVEL
}));
