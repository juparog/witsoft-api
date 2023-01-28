import { ValidationPipe, VersioningType } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfigService } from '@witsoft/config/app-config/app-config.service';

import { AppModule } from './app.module';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService = app.get<AppConfigService>(AppConfigService);

  app.enableCors();
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI,
	  prefix: ''
  });
  app.setGlobalPrefix(appConfigService.apiPrefix);
	app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
  .setTitle(appConfigService.apiName)
  .setDescription(appConfigService.apiDescription)
  .setVersion(appConfigService.apiVersion)
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

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
