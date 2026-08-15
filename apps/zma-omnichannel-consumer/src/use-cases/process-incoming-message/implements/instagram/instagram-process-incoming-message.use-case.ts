import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ClientService } from '@zma-nestjs-omnichannel/zma-grpc/client';
import { MicroserviceInput } from '@zma-nestjs-omnichannel/zma-types';
import { ClientServiceCheckOrCreateInput } from '@zma-nestjs-omnichannel/zma-types/inputs/client_input';
import { IdUtils } from '@zma-nestjs-omnichannel/zma-utils';
import { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';

import { KafkaTopicsEnum } from '../../../../core/types';
import { Platform } from '../../../../core/types/enums/platform.enum';
import { DaprProducerService } from '../../../../framework/dapr/dapr.producer.service';
import { ProcessIncomingMessageUseCase } from '../../interfaces/process-incoming-message.use-case.interface';

@Injectable()
export class InstagramProcessIncomingMessageUseCase
  implements ProcessIncomingMessageUseCase, OnModuleInit
{
  private readonly logger = new Logger(InstagramProcessIncomingMessageUseCase.name);
  private clientService: ClientService;

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    //private readonly kafkaProducer: KafkaProducerService,
    private readonly daprProducer: DaprProducerService,
    @Inject('CLIENT_SERVICE_GRPC')
    private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.clientService = this.grpcClient.getService<ClientService>('ClientService');
  }

  async execute(body: any): Promise<void> {
    this.logger.log('Webhook Body: ' + JSON.stringify(body, null, 2));
    const entry = body.entry?.[0];
    const messaging = entry?.messaging?.[0];
    if (!messaging) return;

    const isEcho = !!messaging.message?.is_echo;
    const platformId = isEcho ? messaging.recipient?.id : messaging.sender?.id;
    const timestamp = messaging.timestamp;

    if (!platformId || !timestamp) {
      this.logger.warn('⚠️ Missing platformId or timestamp.');
      return;
    }

    if (!isEcho) {
      await this.checkAndCacheUser(platformId);
    }

    if (messaging.message && !isEcho) {
      await this.handleUserMessage(messaging, platformId, timestamp);
      return;
    }
    if (messaging.delivery) {
      await this.handleDelivery(timestamp, platformId);
      return;
    }
    if (messaging.read) {
      await this.handleRead(timestamp, platformId);
      return;
    }
    if (isEcho) {
      this.logger.debug('ℹ️ Ignoring is_echo message (sent by page).');
      return;
    }
    this.logger.warn('⚠️ Unmatched message/delivery/read event.');
  }

  private async checkAndCacheUser(platformId: string): Promise<void> {
    const cacheKey = `user:${Platform.Instagram}:${platformId}`;
    await this.cacheManager.wrap(cacheKey, async () => {
      try {
        const wrapper = new MicroserviceInput<ClientServiceCheckOrCreateInput>({
          requestId: IdUtils.uuidv7(),
          data: { platform: Platform.Instagram, platformId: platformId },
        });
        this.logger.log(`Grpc sent with clientID: ${platformId}`);
        const result = await firstValueFrom(this.clientService.checkOrCreateClient(wrapper));
        return !!result?.ok;
      } catch (err) {
        this.logger.error('❌ gRPC error:', err);
        throw err;
      }
    });
  }

  private async handleUserMessage(
    messaging: any,
    platformId: string,
    timestamp: number,
  ): Promise<void> {
    const { text = '', attachments = [], mid } = messaging.message;
    const refId = messaging.message.reply_to?.mid ?? null;
    const payload = {
      platform: Platform.Instagram,
      platformId,
      message: text,
      attachmentsRaw: attachments,
      timestamp,
      msgPlatformId: mid,
      refId,
    };
    await this.daprProducer.sendMessage(KafkaTopicsEnum.InstagramMessageReceived, payload);
    this.logger.log('📩 Sent to INSTAGRAM_MESSAGE_RECEIVED');
    //this.logger.log('📩 Payload: ' + JSON.stringify(payload, null, 2));
  }

  private async handleDelivery(timestamp: number, platformId: string): Promise<void> {
    await this.daprProducer.sendMessage(KafkaTopicsEnum.InstagramMessageDelivered, {
      platform: Platform.Instagram,
      platformId,
      watermark: timestamp,
    });
    this.logger.log('📦 Sent DELIVERY event');
  }

  private async handleRead(timestamp: number, platformId: string): Promise<void> {
    await this.daprProducer.sendMessage(KafkaTopicsEnum.InstagramMessageRead, {
      platform: Platform.Instagram,
      platformId,
      watermark: timestamp,
    });
    this.logger.log('📖 Sent READ event');
  }
}
