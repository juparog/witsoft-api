import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { Logger } from '@nestjs/common/services';
import { AppConfigService } from '@/config/app-config.service';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get(AppConfigService);
  await app.listen(appConfigService.port, () =>
    logger.log(`Server is running on port ${appConfigService.port}`)
  );
}
bootstrap();
