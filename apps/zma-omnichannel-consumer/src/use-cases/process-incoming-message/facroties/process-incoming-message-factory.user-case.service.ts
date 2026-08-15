import { Inject, Injectable } from '@nestjs/common';

import { KafkaTopicsEnum } from '../../../core/types';
import { FacebookProcessIncomingMessageUseCase } from '../implements/facebook/facebook-process-incoming-message.use-case';
import { InstagramProcessIncomingMessageUseCase } from '../implements/instagram/instagram-process-incoming-message.use-case';
import { WhatsappProcessIncomingMessageUseCase } from '../implements/whatsapp/whatsapp-process-incoming-message.use-case';
import { ZaloProcessIncomingMessageUseCase } from '../implements/zalo/zalo-process-incoming-message.use-case';
import { ProcessIncomingMessageUseCase } from '../interfaces/process-incoming-message.use-case.interface';
@Injectable()
export class ProcessIncomingMessageFactoryService {
  constructor(
    @Inject(FacebookProcessIncomingMessageUseCase)
    private readonly facebookUseCase: ProcessIncomingMessageUseCase,

    @Inject(ZaloProcessIncomingMessageUseCase)
    private readonly zaloUseCase: ProcessIncomingMessageUseCase,

    @Inject(InstagramProcessIncomingMessageUseCase)
    private readonly instagramUseCase: ProcessIncomingMessageUseCase,

    @Inject(WhatsappProcessIncomingMessageUseCase)
    private readonly whatsappUseCase: ProcessIncomingMessageUseCase,
  ) {}

  getUseCase(topic: string): ProcessIncomingMessageUseCase {
    switch (topic) {
      case KafkaTopicsEnum.FacebookWebhook:
        return this.facebookUseCase;
      case KafkaTopicsEnum.ZaloWebhook:
        return this.zaloUseCase;
      case KafkaTopicsEnum.InstagramWebhook:
        return this.instagramUseCase;
      case KafkaTopicsEnum.WhatsAppWebhook:
        return this.whatsappUseCase;
      default:
        throw new Error(`Unsupported topic: ${topic}`);
    }
  }
}
