import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('POST-TEST-API')
    .setDescription('POST-TEST-API documentation')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .addTag('Developed by Azat Nasyrov')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}

bootstrap();
