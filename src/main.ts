import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@/modules/config/config.service';

import { AppModule } from './app.module';
import { Logger } from '@nestjs/common/services';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.port, () =>
    logger.log(`Server is running on port ${configService.port}`)
  );
}
bootstrap();
