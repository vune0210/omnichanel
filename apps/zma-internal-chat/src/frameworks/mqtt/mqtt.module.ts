import { Module } from '@nestjs/common';

import { MessageUseCaseModule } from '../../use-cases/message_old/message.use-case.module';

import { MqttService } from './mqtt.service';

@Module({
  imports: [
    MessageUseCaseModule,
  ],
  providers: [
    MqttService,
  ],
  exports: [MqttService],
})
export class MqttModule {}
