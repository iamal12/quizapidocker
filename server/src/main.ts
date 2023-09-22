import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1')
  const config = new DocumentBuilder().setTitle('Quiz App')
    .setDescription('API for quiz app')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
    
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)
  // app.useWebSocketAdapter(socketAdapter)
  await app.listen(3002);
}
bootstrap();
