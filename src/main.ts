import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
async function bootstrap() {
  ConfigModule.forRoot({
    envFilePath: ['.env'],
  });

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,

      forbidUnknownValues: false,
    }),
  );
  app.setGlobalPrefix('v1/api');
  // app.useGlobalGuards(AuthGuard(''));
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://example.com',
      'http://www.example.com',
      'http://app.example.com',
      'https://example.com',
      'https://www.example.com',
      'https://app.example1.com',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    // credentials: true,
  });
  await app.listen(5000);
}
bootstrap();
