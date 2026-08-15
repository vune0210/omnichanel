import { join } from 'path';

import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ServiceName } from '@zma-nestjs-omnichannel/zma-types';
import figlet from 'figlet';
import * as googleProtoFiles from 'google-proto-files';
import morgan from 'morgan';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // GRPC Server Configuration
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: ServiceName.STORAGE,
      protoPath: join(__dirname, 'src/proto/storage.proto'),
      url: process.env.NX_GRPC_URL || '0.0.0.0:5000',
      loader: {
        includeDirs: [googleProtoFiles.getProtoPath('google/protobuf')],
      },
    },
  });

  app.use(morgan('combined'));
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }),
    new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  Logger.log('Starting Microservices');
  await app.startAllMicroservices();
  Logger.log('Microservices started');

  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 3000;

  await app.listen(port, host);
  Logger.log(figlet.textSync('zma-storage !'));
  Logger.log(`🚀 Application is running on: http://${host}:${port}/graphql`);
}

bootstrap();
