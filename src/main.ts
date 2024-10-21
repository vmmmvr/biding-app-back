import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS with default or custom options
  app.enableCors({
    origin: '*', // Allow all origins. Replace with specific domains in production.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true, 
      },
    }),
  );

  const configService = app.get(ConfigService);
  // Get the port from environment variable with a default fallback
  const port = configService.get<number>('PORT', 2000);
  await app.listen(port);
}
bootstrap();
