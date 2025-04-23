/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig, ResponseInterceptor } from './app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = process.env.PORT; // Used like this because Render isexpecting so
  const host = '0.0.0.0';

  app.enableCors();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(port, host, () => {
    Logger.log(`🚀 Application is running on port ${port}`);
  });
}

bootstrap();
