import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuration CORS plus détaillée
  app.enableCors({
    origin: ['http://localhost:3000', 'http://13.49.240.163', 'http://optilogis-frontend.s3-website.eu-north-1.amazonaws.com'], // Ajoutez ici toutes les origines autorisées
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Configuration pour servir les fichiers statiques
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.useGlobalPipes(new ValidationPipe());

  // Log pour vérifier le chemin des uploads
  console.log('Uploads path:', join(__dirname, '..', 'uploads'));

  await app.listen(5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();