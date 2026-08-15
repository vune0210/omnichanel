import { Injectable, Logger } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';

import { KafkaTopicsEnum } from '../../../../core/types';
import { MessageUseCaseFacebook } from '../../../../use-cases/message_old/implements/facebook/message.use-case.facebook';
import { KafkaHandler } from '../../decorators';
@Injectable()
@KafkaHandler(KafkaTopicsEnum.FacebookMessageRead)
export class FacebookMessageReadConsumer {
  private readonly logger = new Logger(FacebookMessageReadConsumer.name);

  constructor(private readonly messageUseCaseFacebook: MessageUseCaseFacebook) {}

  async handleMessage({ message }: EachMessagePayload) {
    const raw = message.value?.toString();
    if (!raw) {
      this.logger.warn('⚠️ Không có dữ liệu trong message FacebookMessageReadConsumer');
      return;
    }

    try {
      this.logger.debug(`📖 [Facebook] READ: ${raw}`);

      const { platformId: clientPlatformId, watermark } = JSON.parse(raw);

      await this.messageUseCaseFacebook.markMessageAsRead({ clientPlatformId, watermark });
    } catch (err) {
      this.logger.error(`❌ Error handling FACEBOOK_MESSAGE_READ: ${err.message}`, err.stack);
    }
  }
}
