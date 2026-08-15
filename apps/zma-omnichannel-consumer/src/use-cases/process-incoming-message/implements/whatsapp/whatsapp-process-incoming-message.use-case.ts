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
export class WhatsappProcessIncomingMessageUseCase
  implements ProcessIncomingMessageUseCase, OnModuleInit
{
  private readonly logger = new Logger(WhatsappProcessIncomingMessageUseCase.name);
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
    const change = entry?.changes?.[0];
    if (!change) return;

    const value = change.value;
    if (!value) return;

    if (value.statuses) {
      const status = value.statuses[0];
      if (!status) return;

      const platformId = status.recipient_id;
      const timestamp = status.timestamp;

      if (!platformId || !timestamp) {
        this.logger.warn('⚠️ Missing platformId or timestamp in status.');
        return;
      }

      if (status.status === 'delivered') {
        await this.handleDelivery(timestamp, platformId);
        return;
      }
      if (status.status === 'read') {
        await this.handleRead(timestamp, platformId);
        return;
      }
      this.logger.warn('⚠️ Unhandled status type: ' + status.status);
      return;
    }

    if (value.messages) {
      const message = value.messages[0];
      if (!message) return;

      const platformId = message.from;
      const name = value.contacts?.[0]?.profile?.name || 'User';
      const timestamp = message.timestamp;

      if (!platformId || !timestamp) {
        this.logger.warn('⚠️ Missing platformId or timestamp in message.');
        return;
      }

      await this.checkAndCacheUser({ platformId, name });
      await this.handleUserMessage(value, platformId, timestamp);
      return;
    }

    this.logger.warn('⚠️ Unmatched webhook type.');
  }

  private async checkAndCacheUser({
    platformId,
    name
  }: {
    platformId: string;
    name: string;
  }): Promise<void> {
    const cacheKey = `user:${Platform.WhatsApp}:${platformId}`;
    await this.cacheManager.wrap(cacheKey, async () => {
      try {
        const wrapper = new MicroserviceInput<ClientServiceCheckOrCreateInput>({
          requestId: IdUtils.uuidv7(),
          data: {
            platform: Platform.WhatsApp,
            platformId: platformId,
            name,
           },
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
    value: any,
    platformId: string,
    timestamp: number,
  ): Promise<void> {
    const message = value.messages[0];
    const text = message.type === 'text' ? message.text.body : '';
    const attachments = []; // TODO: Handle non-text types if needed
    const mid = message.id;
    const refId = message.context?.id ?? null;
    const payload = {
      platform: Platform.WhatsApp,
      platformId,
      message: text,
      attachmentsRaw: attachments,
      timestamp: timestamp * 1000,
      msgPlatformId: mid,
      refId,
    };
    await this.daprProducer.sendMessage(KafkaTopicsEnum.WhatsAppMessageReceived, payload);
    this.logger.log('📩 Sent to WHATSAPP_MESSAGE_RECEIVED');
    //this.logger.log('📩 Payload: ' + JSON.stringify(payload, null, 2));
  }
  
  private async handleDelivery(timestamp: number, platformId: string): Promise<void> {
    await this.daprProducer.sendMessage(KafkaTopicsEnum.WhatsAppMessageDelivered, {
      platform: Platform.WhatsApp,
      platformId,
      watermark: timestamp * 1000,
    });
    this.logger.log('📦 Sent DELIVERY event');
  }

  private async handleRead(timestamp: number, platformId: string): Promise<void> {
    await this.daprProducer.sendMessage(KafkaTopicsEnum.WhatsAppMessageRead, {
      platform: Platform.WhatsApp,
      platformId,
      watermark: timestamp * 1000,
    });
    this.logger.log('📖 Sent READ event');
  }
}