import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { Kafka, EachMessagePayload } from 'kafkajs';

import { KAFKA_TOPIC } from './decorators/kafka-handler.decorator';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  async onModuleInit() {
    this.logger.log('🚀 KafkaService.onModuleInit() bắt đầu');

    const clientId = this.configService.get<string>('NX_KAFKA_CLIENT_ID');
    const broker = this.configService.get<string>('NX_KAFKA_BROKER');
    const groupId = this.configService.get<string>('NX_KAFKA_GROUP_ID');

    this.logger.log(`📦 Kafka config: clientId=${clientId}, broker=${broker}, groupId=${groupId}`);

    const kafka = new Kafka({
      clientId,
      brokers: [broker],
    });

    const consumer = kafka.consumer({ groupId });

    await consumer.connect();
    this.logger.log('🔌 Kafka consumer đã kết nối');

    const topicHandlerMap = new Map<string, (payload: EachMessagePayload) => Promise<void>>();

    const providers = this.discoveryService.getProviders();
    this.logger.log(`🔍 Đang kiểm tra ${providers.length} provider...`);

    for (const wrapper of providers) {
      const instance = wrapper.instance;
      if (!instance) continue;

      const topic = this.reflector.get<string>(KAFKA_TOPIC, instance.constructor);
      if (!topic) continue;

      if (typeof instance.handleMessage !== 'function') {
        this.logger.warn(`⚠️ Handler không có hàm handleMessage: ${instance.constructor.name}`);
        continue;
      }

      this.logger.log(`✅ Gắn handler: ${instance.constructor.name} cho topic: ${topic}`);
      await consumer.subscribe({ topic, fromBeginning: false });
      this.logger.log(`📥 Đã subscribe Kafka topic: ${topic}`);

      topicHandlerMap.set(topic, instance.handleMessage.bind(instance));
    }

    await consumer.run({
      eachMessage: async (payload) => {
        const topic = payload.topic;
        const handler = topicHandlerMap.get(topic);

        this.logger.debug(`📨 Nhận message từ topic: ${topic}`);

        if (handler) {
          try {
            await handler(payload);
          } catch (err) {
            this.logger.error(`❌ Lỗi xử lý message từ topic ${topic}:`, err);
          }
        } else {
          this.logger.warn(`⚠️ Không tìm thấy handler cho topic: ${topic}`);
        }
      },
    });

    this.logger.log('✅ Kafka consumer đã bắt đầu lắng nghe topic');
  }
}
