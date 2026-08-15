import { Module } from '@nestjs/common';

import { GrpcClientModule } from '../../framework/grpc/grpc-client.module';

import { DaprProducerModule } from '../../framework/dapr/dapr.producer.module';
import { ProcessIncomingMessageFactoryService } from './facroties/process-incoming-message-factory.user-case.service';
import { FacebookProcessIncomingMessageUseCase } from './implements/facebook/facebook-process-incoming-message.use-case';
import { ZaloProcessIncomingMessageUseCase } from './implements/zalo/zalo-process-incoming-message.use-case';
import { InstagramProcessIncomingMessageUseCase } from './implements/instagram/instagram-process-incoming-message.use-case';
import { WhatsappProcessIncomingMessageUseCase } from './implements/whatsapp/whatsapp-process-incoming-message.use-case';

@Module({
  imports: [DaprProducerModule, GrpcClientModule],
  providers: [
    FacebookProcessIncomingMessageUseCase,
    ZaloProcessIncomingMessageUseCase,
    InstagramProcessIncomingMessageUseCase,
    WhatsappProcessIncomingMessageUseCase,
    ProcessIncomingMessageFactoryService,
  ],
  exports: [ProcessIncomingMessageFactoryService],
})
export class ProcessIncomingMessageUseCaseModule {}
