import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DaprSubscribeController } from './dapr.subscriber.controller';
import { ProcessIncomingMessageUseCaseModule } from '../../use-cases/process-incoming-message/process-incoming-message.use-case.module';

@Module({
  imports: [HttpModule, ProcessIncomingMessageUseCaseModule],
  controllers: [DaprSubscribeController],
})
export class DaprConsumerModule {}