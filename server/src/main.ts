import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/+$/, '');
}

function isAllowedOrigin(origin: string | undefined) {
  if (!origin) {
    return true;
  }

  const normalized = normalizeOrigin(origin);
  const allowed = getAllowedOrigins();

  if (allowed.includes(normalized)) {
    return true;
  }

  if (normalized.endsWith('.vercel.app')) {
    return true;
  }

  return false;
}

function getAllowedOrigins() {
  const origins = new Set<string>([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ]);

  const clientUrl = process.env.CLIENT_URL;
  if (clientUrl) {
    origins.add(normalizeOrigin(clientUrl));
  }

  const extraOrigins = process.env.CORS_ORIGINS?.split(',') ?? [];
  for (const origin of extraOrigins) {
    if (origin.trim()) {
      origins.add(normalizeOrigin(origin));
    }
  }

  return [...origins];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.enableCors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
