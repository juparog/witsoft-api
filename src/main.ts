import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { Logger } from '@nestjs/common/services';
import { ConfigService } from '@nestjs/config';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  await app.listen(port, () => logger.log(`Server is running on port ${port}`));
}
bootstrap();
