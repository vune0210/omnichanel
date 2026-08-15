import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ZmaI18nModule } from '@zma-nestjs-omnichannel/zma-i18n';
import { AppExceptionFilter } from '@zma-nestjs-omnichannel/zma-middlewares';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { configurations } from './configuration';
import { FacebookWebhookController } from './controllers/webhook/platform/facebook/facebook.webhook.controller';
import { GrpcClientModule } from './framework/grpc/grpc-client.module';
//import { KafkaModule } from './framework/kafka/kafka.module';
import { DaprConsumerModule } from './framework/dapr/dapr.consumer.module';
import { InstagramWebhookController } from './controllers/webhook/platform/instagram/instagram.webhook.controller';
import { WhatsappWebhookController } from './controllers/webhook/platform/whatsapp/whatsapp.webhook.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configurations],
    }),

    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('zma-omnichannel-consumer', {
                colors: true,
                prettyPrint: true,
              }),
            ),
          }),
        ],
      }),
      inject: [],
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get<number>('NX_GRPC_CACHE_TTL', 0),
      }),
      inject: [ConfigService],
    }),

    ZmaI18nModule,
    //KafkaModule,
    DaprConsumerModule,
    GrpcClientModule,
  ],

  controllers: [
    FacebookWebhookController,
    InstagramWebhookController,
    WhatsappWebhookController,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
