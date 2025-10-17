import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get configuration service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const corsOrigin = configService.get<string>(
    'CORS_ORIGIN',
    'http://localhost:5173',
  );

  // Enable CORS for multiple origins (localhost and network IP)
  app.enableCors({
    origin: [
      corsOrigin,
      'http://localhost:5173',
      'http://localhost:3001',
      'http://10.147.1.122:3001',
      /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/, // Allow any local network IP
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix for API routes
  const apiPrefix = configService.get<string>('API_PREFIX', 'api');
  const apiVersion = configService.get<string>('API_VERSION', 'v1');
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  await app.listen(port);

  console.log(`
    🚀 Server is running on: http://localhost:${port}
    📡 API prefix: /${apiPrefix}/${apiVersion}
    🌐 CORS enabled for: ${corsOrigin}
    📦 Environment: ${configService.get<string>('NODE_ENV', 'development')}
  `);
}

bootstrap();
