import { Injectable, Logger } from '@nestjs/common';
import { EachMessagePayload } from 'kafkajs';

import { KafkaTopicsEnum } from '../../../../core/types';
import { MessageUseCaseFacebook } from '../../../../use-cases/message/implements/facebook/message.use-case.facebook';
import { KafkaHandler } from '../../decorators';
@Injectable()
@KafkaHandler(KafkaTopicsEnum.FacebookMessageDelivered)
export class FacebookMessageDeliveredConsumer {
  private readonly logger = new Logger(FacebookMessageDeliveredConsumer.name);

  constructor(private readonly messageUseCaseFacebook: MessageUseCaseFacebook) {}

  async handleMessage({ message }: EachMessagePayload) {
    const raw = message.value?.toString();
    if (!raw) {
      this.logger.warn('⚠️ Không có dữ liệu trong message FacebookMessageDeliveredConsumer');
      return;
    }

    try {
      this.logger.debug(`📦 [Facebook] DELIVERED: ${raw}`);

      const { platformId: clientPlatformId, watermark } = JSON.parse(raw);

      //await this.messageUseCaseFacebook.markMessageAsDelivered({ clientPlatformId, watermark });
    } catch (err) {
      this.logger.error(`❌ Error handling FACEBOOK_MESSAGE_DELIVERED: ${err.message}`, err.stack);
    }
  }
}
