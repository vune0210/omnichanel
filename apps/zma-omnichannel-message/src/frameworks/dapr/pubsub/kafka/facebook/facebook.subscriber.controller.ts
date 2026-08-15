import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PlatformEnum } from '../../../../../core/types';
import { ClientUseCase } from '../../../../../use-cases/client/client.use-case';
import { MessageUseCaseFactory } from '../../../../../use-cases/message/factories/message.use-case.factory';

@Controller()
export class FacebookSubscriberController {
  private readonly logger = new Logger(FacebookSubscriberController.name);

  constructor(
    private readonly messageUseCaseFactory: MessageUseCaseFactory,
    private readonly clientUseCase: ClientUseCase
  ) {}

  @Post('facebook.message-received')
  async handleMessageReceived(@Body() body: any) {
    const payload = body.data;
    if (!payload) {
      this.logger.warn('⚠️ Không có dữ liệu trong facebook.message-received');
      return { status: 'DROP' };
    }

    try {
      this.logger.log(`📩 [Facebook] RECEIVED: ${JSON.stringify(payload)}`);

      const {
        platformId,
        message: msgText,
        attachmentsRaw,
        timestamp,
        msgPlatformId,
        refId,
      } = payload;
      await this.clientUseCase.updateLastInteract({ platform: PlatformEnum.Facebook, clientPlatformId: platformId, watermark: timestamp });
      const messageUseCaseFacebook = this.messageUseCaseFactory.get(PlatformEnum.Facebook);
      await messageUseCaseFacebook.saveUserMessage({
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

  @Post('facebook.message-delivered')
  async handleMessageDelivered(@Body() body: any) {
    const payload = body.data;

    if (!body) {
      this.logger.warn('⚠️ Không có dữ liệu trong facebook.message-delivered');
      return { status: 'DROP' };
    }

    try {
      this.logger.debug(`📦 [Facebook] DELIVERED: ${JSON.stringify(payload)}`);

      const { platformId: clientPlatformId, watermark } = payload;

      //const messageUseCaseFacebook = this.messageUseCaseFactory.get(PlatformEnum.Facebook);
      //await messageUseCaseFacebook.markMessageAsDelivered({ clientPlatformId, watermark });
      await this.clientUseCase.updateClientDeliveredWatermark({ platform: PlatformEnum.Facebook, clientPlatformId, watermark });

      return { status: 'SUCCESS' };
    } catch (err) {
      this.logger.error(`❌ facebook.message-delivered: ${err.message}`, err.stack);
      return { status: 'RETRY' };
    }
  }

  @Post('facebook.message-read')
  async handleMessageRead(@Body() body: any) {
    const payload = body.data;
    if (!payload) {
      this.logger.warn('⚠️ Không có dữ liệu trong facebook.message-read');
      return { status: 'DROP' };
    }

    try {
      this.logger.debug(`📖 [Facebook] READ: ${JSON.stringify(payload)}`);

      const { platformId: clientPlatformId, watermark } = payload;

      // const messageUseCaseFacebook = this.messageUseCaseFactory.get(PlatformEnum.Facebook);
      // await messageUseCaseFacebook.markMessageAsRead({ clientPlatformId, watermark });
      await this.clientUseCase.updateClientReadWatermark({ platform: PlatformEnum.Facebook, clientPlatformId, watermark });

      return { status: 'SUCCESS' };
    } catch (err) {
      this.logger.error(`❌ facebook.message-read: ${err.message}`, err.stack);
      return { status: 'RETRY' };
    }
  }
}
