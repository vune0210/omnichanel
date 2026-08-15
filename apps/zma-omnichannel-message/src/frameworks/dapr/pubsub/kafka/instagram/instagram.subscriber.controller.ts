import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PlatformEnum } from '../../../../../core/types';
import { ClientUseCase } from '../../../../../use-cases/client/client.use-case';
import { MessageUseCaseFactory } from '../../../../../use-cases/message/factories/message.use-case.factory';

@Controller()
export class InstagramSubscriberController {
  private readonly logger = new Logger(InstagramSubscriberController.name);

  constructor(
    private readonly messageUseCaseFactory: MessageUseCaseFactory,
    private readonly clientUseCase: ClientUseCase
  ) {}

  @Post('instagram.message-received')
  async handleMessageReceived(@Body() body: any) {
    const payload = body.data;
    if (!payload) {
      this.logger.warn('⚠️ Không có dữ liệu trong instagram.message-received');
      return { status: 'DROP' };
    }

    try {
      this.logger.log(`📩 [Instagram] RECEIVED: ${JSON.stringify(payload)}`);

      const {
        platformId,
        message: msgText,
        attachmentsRaw,
        timestamp,
        msgPlatformId,
        refId,
      } = payload;

      await this.clientUseCase.updateLastInteract({ platform: PlatformEnum.Instagram, clientPlatformId: platformId, watermark: timestamp });
      const messageUseCaseInstagram = this.messageUseCaseFactory.get(PlatformEnum.Instagram);
      await messageUseCaseInstagram.saveUserMessage({
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

  @Post('instagram.message-delivered')
  async handleMessageDelivered(@Body() body: any) {
    const payload = body.data;

    if (!body) {
      this.logger.warn('⚠️ Không có dữ liệu trong instagram.message-delivered');
      return { status: 'DROP' };
    }

    try {
      this.logger.debug(`📦 [Instagram] DELIVERED: ${JSON.stringify(payload)}`);

      const { platformId: clientPlatformId, watermark } = payload;

      //const messageUseCaseInstagram = this.messageUseCaseFactory.get(PlatformEnum.Instagram);
      //await messageUseCaseInstagram.markMessageAsDelivered({ clientPlatformId, watermark });
      await this.clientUseCase.updateClientDeliveredWatermark({ platform: PlatformEnum.Instagram, clientPlatformId, watermark });

      return { status: 'SUCCESS' };
    } catch (err) {
      this.logger.error(`❌ instagram.message-delivered: ${err.message}`, err.stack);
      return { status: 'RETRY' };
    }
  }

  @Post('instagram.message-read')
  async handleMessageRead(@Body() body: any) {
    const payload = body.data;
    if (!payload) {
      this.logger.warn('⚠️ Không có dữ liệu trong instagram.message-read');
      return { status: 'DROP' };
    }

    try {
      this.logger.debug(`📖 [Instagram] READ: ${JSON.stringify(payload)}`);

      const { platformId: clientPlatformId, watermark } = payload;

      // const messageUseCaseInstagram = this.messageUseCaseFactory.get(PlatformEnum.Instagram);
      // await messageUseCaseInstagram.markMessageAsRead({ clientPlatformId, watermark });
      await this.clientUseCase.updateClientReadWatermark({ platform: PlatformEnum.Instagram, clientPlatformId, watermark });

      return { status: 'SUCCESS' };
    } catch (err) {
      this.logger.error(`❌ instagram.message-read: ${err.message}`, err.stack);
      return { status: 'RETRY' };
    }
  }
}
