import {
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/dto/response.interceptor';
import { envs } from './config/envs';

async function bootstrap() {
  const logger = new Logger('Monolith-App');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.GET }], // for health check
  });
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
    }),
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const config = new DocumentBuilder()
    .setTitle('Organizations API')
    .setDescription('The Organizations API')
    .setVersion('1.0')
    .addTag('Organizations API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Gateway microservice running on port: ${envs.port}`);
}
bootstrap();
