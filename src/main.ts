import { NestFactory } from '@nestjs/core';

import { ConfigService } from '@/modules/config/config.service';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  await app.listen(configService.port, () =>
    console.log(`Listening on port ${configService.port}`)
  );
}
bootstrap();
