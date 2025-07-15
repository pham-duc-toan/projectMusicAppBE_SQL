import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  app.use(cookieParser());

  const reflector = app.get(Reflector);
  // app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Cấu hình CORS
  app.enableCors({
    origin: 'http://13.215.228.26',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],
  });

  // Swagger cấu hình
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Music App API')
    .setDescription('Tài liệu RESTful API cho Music App Backend')
    .setVersion('1.0')
    .addCookieAuth() // Nếu có dùng cookie cho auth
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get<number>('PORT') || 2207;
  await app.listen(port);

  console.log(`Server chạy tại http://localhost:${port}`);
  console.log(`Swagger UI tại http://localhost:${port}/api-docs`);
}
bootstrap();
