import { join } from 'path';

import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import figlet from 'figlet';
import * as googleProtoFiles from 'google-proto-files';
import morgan from 'morgan';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { KafkaService } from './frameworks/kafka/kafka.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Microservices 1
  // app.connectMicroservice({
  //   transport: Transport.TCP,
  //   options: {
  //     host: 'localhost',
  //     port: 3001,
  //   },
  // });

  // app.connectMicroservice({
  //   transport: Transport.GRPC,
  //   options: {
  //     package: 'ClientService',
  //     protoPath: join(process.cwd(), 'libs/zma-grpc/src/proto/client.proto'),
  //     url: process.env.NX_GRPC_URL || '0.0.0.0:5000',
  //     loader: {
  //       //keepCase: true,
  //       includeDirs: [googleProtoFiles.getProtoPath('google/protobuf')],
  //       // longs: String,
  //       // enums: String,
  //       // defaults: true,
  //       // oneofs: true,
  //     },
  //   },
  // });

  app.get(KafkaService);
  app.use(morgan('combined'));
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }),
    new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 3000;

  Logger.log('Starting Microservices');
  await app.startAllMicroservices();
  Logger.log('Microservices started');

  await app.listen(port, host);
  Logger.log(figlet.textSync('zma-internal-chat !'));
  Logger.log(`🚀 Application is running on: http://${host}:${port}/graphql`);
}

bootstrap();
