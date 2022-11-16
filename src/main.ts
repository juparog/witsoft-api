import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { Logger } from '@nestjs/common/services';
import { AppConfigService } from '@/services/app-config/app-config.service';
import { VersioningType } from '@nestjs/common';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfigService = app.get<AppConfigService>(AppConfigService);
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI
  });
  app.setGlobalPrefix('api');
  const HOST = appConfigService.host;
  const PORT = appConfigService.port;
  await app.listen(PORT, HOST, () => {
    logLogo();
    logger.log(`Listening at http://${HOST}:${PORT}`);
    logger.log('');
  });
}

function logLogo() {
  logger.log(`   `);
  logger.log(
    ` __     __     __     ______   ______     ______     ______   ______   `
  );
  logger.log(
    `/\\ \\  _ \\ \\   /\\ \\   /\\__  _\\ /\\  ___\\   /\\  __ \\   /\\  ___\\ /\\__  _\\ `
  );
  logger.log(
    `\\ \\ \\/ ".\\ \\  \\ \\ \\  \\/_/\\ \\/ \\ \\___  \\  \\ \\ \\/\\ \\  \\ \\  __\\ \\/_/\\ \\/ `
  );
  logger.log(
    ` \\ \\__/".~\\_\\  \\ \\_\\    \\ \\_\\  \\/\\_____\\  \\ \\_____\\  \\ \\_\\      \\ \\_\\ `
  );
  logger.log(
    `  \\/_/   \\/_/   \\/_/     \\/_/   \\/_____/   \\/_____/   \\/_/       \\/_/ `
  );
  logger.log(`   `);
}

bootstrap();
