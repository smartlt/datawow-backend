import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins. In production, specify actual allowed origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Apply validation pipes globally
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('DataWow API')
    .setDescription('The DataWow API documentation')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3003);
}
bootstrap();
