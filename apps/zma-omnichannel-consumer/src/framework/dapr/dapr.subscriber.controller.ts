import { Controller, Post, Body, Get } from '@nestjs/common';
import { KafkaTopicsEnum } from '../../core/types/enums';
import { ProcessIncomingMessageFactoryService } from '../../use-cases/process-incoming-message/facroties/process-incoming-message-factory.user-case.service';
import { ProcessIncomingMessageUseCase } from '../../use-cases/process-incoming-message/interfaces/process-incoming-message.use-case.interface';

@Controller()
export class DaprSubscribeController {
  private readonly useCaseMap = new Map<string, ProcessIncomingMessageUseCase>();

  constructor(
    private readonly useCaseFactory: ProcessIncomingMessageFactoryService,
  ) {}

  @Post('facebook-webhook')
  async handleFacebook(@Body() body: any) {
    let useCase = this.useCaseMap.get(KafkaTopicsEnum.FacebookWebhook);
    if (!useCase) {
      useCase = this.useCaseFactory.getUseCase(KafkaTopicsEnum.FacebookWebhook);
      this.useCaseMap.set(KafkaTopicsEnum.FacebookWebhook, useCase);
    }
    await useCase.execute(body);
  }

  @Post('zalo-webhook')
  async handleZalo(@Body() body: any) {
    let useCase = this.useCaseMap.get(KafkaTopicsEnum.ZaloWebhook);
    if (!useCase) {
      useCase = this.useCaseFactory.getUseCase(KafkaTopicsEnum.ZaloWebhook);
      this.useCaseMap.set(KafkaTopicsEnum.ZaloWebhook, useCase);
    }
    await useCase.execute(body);
  }

  @Post('instagram-webhook')
  async handleInstagram(@Body() body: any) {
    let useCase = this.useCaseMap.get(KafkaTopicsEnum.InstagramWebhook);
    if (!useCase) {
      useCase = this.useCaseFactory.getUseCase(KafkaTopicsEnum.InstagramWebhook);
      this.useCaseMap.set(KafkaTopicsEnum.InstagramWebhook, useCase);
    }
    await useCase.execute(body);
  }

  @Post('whatsapp-webhook')
  async handleWhatsApp(@Body() body: any) {
    let useCase = this.useCaseMap.get(KafkaTopicsEnum.WhatsAppWebhook);
    if (!useCase) {
      useCase = this.useCaseFactory.getUseCase(KafkaTopicsEnum.WhatsAppWebhook);
      this.useCaseMap.set(KafkaTopicsEnum.WhatsAppWebhook, useCase);
    }
    await useCase.execute(body);
  }

}
