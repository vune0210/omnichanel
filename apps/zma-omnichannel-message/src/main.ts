import { join } from 'path';

import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import figlet from 'figlet';
import * as googleProtoFiles from 'google-proto-files';
import morgan from 'morgan';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
//import { KafkaService } from './frameworks/kafka/kafka.service';

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
  //app.use(bodyParser.json({ type: '*/*' }));
  app.use(bodyParser.json({
  type: ['application/json', 'application/cloudevents+json']
}));
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'ClientService',
      protoPath: join(process.cwd(), 'libs/zma-grpc/src/proto/client.proto'),
      url: process.env.NX_GRPC_URL || '0.0.0.0:5000',
      loader: {
        includeDirs: [googleProtoFiles.getProtoPath('google/protobuf')],
      },
    },
  });

  //app.get(KafkaService);
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
  Logger.log(figlet.textSync('zma-omnichannel-message !'));
  Logger.log(`🚀 Application is running on: http://${host}:${port}/graphql`);
}

bootstrap();
