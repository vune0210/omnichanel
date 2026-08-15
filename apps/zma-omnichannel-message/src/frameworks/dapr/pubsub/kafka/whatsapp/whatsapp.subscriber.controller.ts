import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PlatformEnum } from '../../../../../core/types';
import { ClientUseCase } from '../../../../../use-cases/client/client.use-case';
import { MessageUseCaseFactory } from '../../../../../use-cases/message/factories/message.use-case.factory';

@Controller()
export class WhatsAppSubscriberController {
  private readonly logger = new Logger(WhatsAppSubscriberController.name);

  constructor(
    private readonly messageUseCaseFactory: MessageUseCaseFactory,
    private readonly clientUseCase: ClientUseCase
  ) {}

  @Post('whatsapp.message-received')
  async handleMessageReceived(@Body() body: any) {
    const payload = body.data;
    if (!payload) {
      this.logger.warn('⚠️ Không có dữ liệu trong whatsapp.message-received');
      return { status: 'DROP' };
    }

    try {
      this.logger.log(`📩 [WhatsApp] RECEIVED: ${JSON.stringify(payload)}`);

      const {
        platformId,
        message: msgText,
        attachmentsRaw,
        timestamp,
        msgPlatformId,
        refId,
      } = payload;

      await this.clientUseCase.updateLastInteract({ platform: PlatformEnum.WhatsApp, clientPlatformId: platformId, watermark: timestamp });
      const messageUseCaseWhatsApp = this.messageUseCaseFactory.get(PlatformEnum.WhatsApp);
      await messageUseCaseWhatsApp.saveUserMessage({
        clientPlatformId: platformId,
        msgText,
        timestamp,
        msgPlatformId,
        attachmentsRaw,
        refId,
      });

      return { status: 'SUCCESS' };
    } catch (err) {
      this.logger.error(`❌ facebook.message-received: ${err.message}`, err.stack);
      return { status: 'RETRY' };
    }
  }

  @Post('whatsapp.message-delivered')
  async handleMessageDelivered(@Body() body: any) {
    const payload = body.data;

    if (!body) {
      this.logger.warn('⚠️ Không có dữ liệu trong whatsapp.message-delivered');
      return { status: 'DROP' };
    }

    try {
      this.logger.debug(`📦 [WhatsApp] DELIVERED: ${JSON.stringify(payload)}`);

      const { platformId: clientPlatformId, watermark } = payload;

      //const messageUseCaseWhatsApp = this.messageUseCaseFactory.get(PlatformEnum.WhatsApp);
      //await messageUseCaseWhatsApp.markMessageAsDelivered({ clientPlatformId, watermark });
      await this.clientUseCase.updateClientDeliveredWatermark({ platform: PlatformEnum.WhatsApp, clientPlatformId, watermark });

      return { status: 'SUCCESS' };
    } catch (err) {
      this.logger.error(`❌ whatsapp.message-delivered: ${err.message}`, err.stack);
      return { status: 'RETRY' };
    }
  }

  @Post('whatsapp.message-read')
  async handleMessageRead(@Body() body: any) {
    const payload = body.data;
    if (!payload) {
      this.logger.warn('⚠️ Không có dữ liệu trong whatsapp.message-read');
      return { status: 'DROP' };
    }

    try {
      this.logger.debug(`📖 [WhatsApp] READ: ${JSON.stringify(payload)}`);

      const { platformId: clientPlatformId, watermark } = payload;

      // const messageUseCaseWhatsApp = this.messageUseCaseFactory.get(PlatformEnum.WhatsApp);
      // await messageUseCaseWhatsApp.markMessageAsRead({ clientPlatformId, watermark });
      await this.clientUseCase.updateClientReadWatermark({ platform: PlatformEnum.WhatsApp, clientPlatformId, watermark });

      return { status: 'SUCCESS' };
    } catch (err) {
      this.logger.error(`❌ whatsapp.message-read: ${err.message}`, err.stack);
      return { status: 'RETRY' };
    }
  }
}
