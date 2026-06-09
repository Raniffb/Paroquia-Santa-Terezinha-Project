import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

// ── Variáveis obrigatórias para a aplicação funcionar ────────────────────────
const REQUIRED_ENV = ['DATABASE_URL', 'JWT_SECRET'];

function assertRequiredEnv(): void {
  const missing = REQUIRED_ENV.filter(k => !process.env[k]?.trim());
  if (missing.length > 0) {
    console.error('');
    console.error('❌  Variáveis de ambiente obrigatórias ausentes:');
    missing.forEach(k => console.error(`     • ${k}`));
    console.error('');
    console.error('    Defina-as no arquivo .env antes de iniciar o servidor.');
    console.error('    Consulte .env.example para referência.');
    console.error('');
    process.exit(1);
  }
}

async function bootstrap() {
  assertRequiredEnv();

  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const isProd = config.get<string>('NODE_ENV') === 'production';
  const port   = config.get<number>('PORT') ?? 3000;

  // ── Helmet — cabeçalhos de segurança HTTP ─────────────────────────────────
  // Em dev, CSP desativado para não quebrar o Swagger UI
  app.use(helmet({ contentSecurityPolicy: isProd }));

  // ── CORS ──────────────────────────────────────────────────────────────────
  // FRONTEND_URL aceita múltiplas origens separadas por vírgula.
  // Ex: FRONTEND_URL=https://paroquia.com,https://www.paroquia.com
  const allowedOrigins = config
    .get<string>('FRONTEND_URL', 'http://localhost:4200')
    .split(',')
    .map(u => u.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ── Validação global ──────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // remove campos não declarados nos DTOs
      forbidNonWhitelisted: true, // rejeita requisições com campos desconhecidos
      transform: true,           // converte tipos automaticamente
    }),
  );

  // ── Swagger — apenas em desenvolvimento ───────────────────────────────────
  if (!isProd) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('API – Paróquia Santa Teresinha')
      .setDescription('API REST para gerenciamento do portal paroquial')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    console.log(`📄 Swagger em   http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  console.log(`🚀 API rodando em http://localhost:${port}`);
  console.log(`❤️  Health:       http://localhost:${port}/health`);
  console.log(`🌍 Modo:          ${isProd ? 'produção' : 'desenvolvimento'}`);
  console.log(`🔒 CORS:          ${allowedOrigins.join(', ')}`);
}

bootstrap();
