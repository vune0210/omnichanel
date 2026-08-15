import { Module } from '@nestjs/common';
import { FacebookSubscriberController } from './kafka/facebook/facebook.subscriber.controller';
import { InstagramSubscriberController } from './kafka/instagram/instagram.subscriber.controller'
import { MessageUseCaseModule } from '../../../use-cases/message/message.use-case.module';
import { MqttPublisherModule } from './mqtt/mqtt.publisher.module';
import { ClientUseCaseModule } from 'apps/zma-omnichannel-message/src/use-cases/client/client.use-case.module';
import { WhatsAppSubscriberController } from './kafka/whatsapp/whatsapp.subscriber.controller';

@Module({
  imports: [
    MessageUseCaseModule,
    ClientUseCaseModule,
    MqttPublisherModule,
  ],
  controllers: [
    FacebookSubscriberController,
    InstagramSubscriberController,
    WhatsAppSubscriberController,
  ],
})
export class DaprPubSubModule {}
