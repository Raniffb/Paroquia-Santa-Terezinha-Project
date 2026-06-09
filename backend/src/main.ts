import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — permite o frontend Angular em localhost
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4201'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // remove campos não declarados no DTO
      forbidNonWhitelisted: false,
      transform: true,        // converte tipos automaticamente
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 API rodando em http://localhost:${port}`);
}

bootstrap();
