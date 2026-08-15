import { Injectable, Logger } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';

import { KafkaTopicsEnum } from '../../../../core/types';
import { MessageUseCaseFacebook } from '../../../../use-cases/message/implements/facebook/message.use-case.facebook';
import { KafkaHandler } from '../../decorators';

@Injectable()
@KafkaHandler(KafkaTopicsEnum.FacebookMessageReceived)
export class FacebookMessageReceivedConsumer {
  private readonly logger = new Logger(FacebookMessageReceivedConsumer.name);

  // ✅ Inject use-case thông qua constructor
  constructor(private readonly messageUseCaseFacebook: MessageUseCaseFacebook) {}

  async handleMessage({ message }: EachMessagePayload) {
    const raw = message.value?.toString();
    if (!raw) {
      this.logger.warn('⚠️ Không có dữ liệu trong message FacebookMessageReceivedConsumer');
      return;
    }

    try {
      this.logger.log(`📩 [Facebook] RECEIVED: ${raw}`);

      const {
        platformId,
        message: msgText,
        attachmentsRaw,
        timestamp,
        msgPlatformId,
        refId,
      } = JSON.parse(raw);

      await this.messageUseCaseFacebook.saveUserMessage({
        clientPlatformId: platformId,
        msgText,
        timestamp,
        msgPlatformId,
        attachmentsRaw,
        refId,
      });
    } catch (err) {
      this.logger.error(`❌ FACEBOOK_MESSAGE_RECEIVED: ${err.message}`, err.stack);
    }
  }
}
