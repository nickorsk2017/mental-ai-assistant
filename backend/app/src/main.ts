import 'reflect-metadata';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

function resolveCorsOrigins(configService: ConfigService): string[] {
  const corsOriginValue = configService.get<string>('BACKEND_CORS_ORIGIN');

  if (!corsOriginValue) {
    throw new Error('BACKEND_CORS_ORIGIN must be configured explicitly for credentialed CORS.');
  }

  const corsOrigins = corsOriginValue
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (corsOrigins.length === 0) {
    throw new Error('BACKEND_CORS_ORIGIN must contain at least one allowed origin.');
  }

  if (corsOrigins.includes('*')) {
    throw new Error('BACKEND_CORS_ORIGIN cannot contain "*" when credentials are enabled.');
  }

  return corsOrigins;
}

async function bootstrap(): Promise<void> {
  const application = await NestFactory.create(AppModule);
  const configService = application.get(ConfigService);

  const port = configService.get<number>('BACKEND_PORT') ?? 4000;
  const corsOrigins = resolveCorsOrigins(configService);

  application.use(cookieParser());
  application.enableCors({ origin: corsOrigins, credentials: true });

  await application.listen(port);
  console.log(`API running on port ${port}`);
}

bootstrap();
