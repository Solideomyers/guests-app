import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Get configuration service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // CORS configuration for production and development
  const allowedOrigins = [];

  if (nodeEnv === 'production') {
    // Production: Only allow configured frontend URL
    const frontendUrl = configService.get<string>('FRONTEND_URL');
    if (frontendUrl) {
      allowedOrigins.push(frontendUrl);
    }
  } else {
    // Development: Allow local development URLs
    allowedOrigins.push(
      'http://localhost:5173',
      'http://localhost:3001',
      'http://10.147.1.122:3001',
      /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/, // Allow any local network IP
    );
  }

  // Enable CORS
  app.enableCors({
    origin: allowedOrigins,
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

  // Only log startup info in development
  if (nodeEnv !== 'production') {
    const corsDisplay =
      allowedOrigins.length > 0
        ? allowedOrigins.filter((o) => typeof o === 'string').join(', ')
        : 'localhost:5173';

    console.log(`
    🚀 Server is running on: http://localhost:${port}
    📡 API prefix: /${apiPrefix}/${apiVersion}
    🌐 CORS enabled for: ${corsDisplay}
    📦 Environment: ${nodeEnv}
    `);
  } else {
    console.log(`Server started in production mode on port ${port}`);
  }
}

bootstrap();
