import { NestFactory } from '@nestjs/core';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import * as hpp from 'hpp';
import { HttpExceptionFilter } from './common/filters/http.exception';
import * as bodyParser from 'body-parser';
import { extractErrorMessages } from './common/utils/error-extractor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(hpp());
  app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // For URL-encoded payloads

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = extractErrorMessages(errors);
        return new UnprocessableEntityException(result);
      },
      stopAtFirstError: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
