import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DaprMqttPublisherService } from './mqtt.publisher.service';

@Module({
  imports: [ConfigModule],
  providers: [DaprMqttPublisherService],
  exports: [DaprMqttPublisherService],
})
export class MqttPublisherModule {}
