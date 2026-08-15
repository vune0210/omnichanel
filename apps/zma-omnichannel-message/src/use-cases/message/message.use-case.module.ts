import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

//import { ScyllaDataServicesModule } from '../../frameworks/data-services/scylla/scylla-data-services.module';
import { MqttCoreModule } from '../../frameworks/mqtt-deprecated/mqtt.core.module';
import { DataServicesModule } from '../../services/data-services/data-services.module';

import { MessageUseCaseFactory } from './factories/message.use-case.factory';
import { MessageUseCaseFacebook } from './implements/facebook/message.use-case.facebook';
import { MessageUseCaseZalo } from './implements/zalo/message.use-case.zalo';
import { MessageUseCaseInstagram } from './implements/instagram/message.use-case.instagram';
import { MessageFactoryService } from './message-factory.user-case.service';
import { MqttPublisherModule } from '../../frameworks/dapr/pubsub/mqtt/mqtt.publisher.module';
import { MessageUseCaseWhatsApp } from './implements/whatsapp/message.use-case.whatsapp';

@Module({
  imports: [
    //ScyllaDataServicesModule,
    DataServicesModule,
    //MqttCoreModule,
    MqttPublisherModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        name: 'TEST_SERVICE',
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('URL'),
            port: 3001,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [
    MessageFactoryService,
    MessageUseCaseFacebook,
    MessageUseCaseZalo,
    MessageUseCaseInstagram,
    MessageUseCaseWhatsApp,
    MessageUseCaseFactory,
  ],
  exports: [MessageFactoryService, MessageUseCaseFactory],
})
export class MessageUseCaseModule {}
