import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';

import { ScyllaDataServicesModule } from '../data-services/scylla/scylla-data-services.module';
import { MessageUseCaseFacebook } from '../../use-cases/message_old/implements/facebook/message.use-case.facebook';
import { MessageFactoryService } from '../../use-cases/message_old/message-factory.user-case.service';
import { MqttModule } from '../mqtt/mqtt.module';

import { FacebookMessageDeliveredConsumer } from './consumers/facebook/message-delivered.consumer';
import { FacebookMessageReadConsumer } from './consumers/facebook/message-read.consumer';
import { FacebookMessageReceivedConsumer } from './consumers/facebook/message-received.consumer';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    MqttModule,
    ConfigModule,
    DiscoveryModule,
    ScyllaDataServicesModule,
  ],
  providers: [
    KafkaService,

    // Consumers
    FacebookMessageReceivedConsumer,
    FacebookMessageDeliveredConsumer,
    FacebookMessageReadConsumer,

    // Use cases
    MessageUseCaseFacebook,
    MessageFactoryService,
  ],
})
export class KafkaModule {}
