import {
  ValidationPipe,
  VersioningType,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { SocketIOAdapter } from './chat/socket-oi-adapter';

const DEFAULT_VERSION = '1';

const extractor = (request: FastifyRequest): string | string[] => {
  const requestedVersion =
    <string>request.headers['x-api-version'] ?? DEFAULT_VERSION;

  // If requested version is N, then this generates an array like: ['N', 'N-1', 'N-2', ... , '1']
  return Array.from(
    { length: parseInt(requestedVersion) },
    (_, i) => `${i + 1}`,
  ).reverse();
};

async function bootstrap() {
  // const app = await NestFactory.create(AppModule, new FastifyAdapter(), { cors: true })
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  const configService = app.get(ConfigService);
  const port = parseInt(configService.get('PORT'));
  const clientPort = parseInt(configService.get('CLIENT_PORT'));
  const clientUrl = configService.get('NEXT_PUBLIC_BASE_CLIENT_URL');

  app.enableCors({
    origin: [
      `http://ec2-47-129-30-6.ap-southeast-1.compute.amazonaws.com`,
      new RegExp(`/^http:\/\/192\.168\.1\.([1-9]|[1-9]\d):${clientPort}$/`),
    ],
  });
  app.useWebSocketAdapter(new SocketIOAdapter(app, configService));

  //fix for error of oauth2: setHeaders is not a function
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.addHook('onRequest', (request, reply, done) => {
    reply.setHeader = function (key, value) {
      return this.raw.setHeader(key, value);
    };
    reply.end = function () {
      this.raw.end();
    };
    request.res = reply;
    done();
  });

  // set api router
  app.setGlobalPrefix('api');
  // set api version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: DEFAULT_VERSION,
  });

  // add middleware to validation
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, '0.0.0.0');
}
bootstrap();
