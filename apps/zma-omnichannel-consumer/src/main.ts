import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import { Transport } from '@nestjs/microservices';
import figlet from 'figlet';
import morgan from 'morgan';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // // Microservices 1
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
  Logger.log(figlet.textSync('zma-omnichannel-consumer !'));
  Logger.log(`🚀 Application is running on: http://${host}:${port}`);
}

bootstrap();
