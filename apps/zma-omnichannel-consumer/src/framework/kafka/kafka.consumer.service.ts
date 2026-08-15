import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

import { KafkaTopicsEnum } from '../../core/types/enums';
import { ProcessIncomingMessageFactoryService } from '../../use-cases/process-incoming-message/facroties/process-incoming-message-factory.user-case.service';
import { ProcessIncomingMessageUseCase } from '../../use-cases/process-incoming-message/interfaces/process-incoming-message.use-case.interface';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private consumer: Consumer;
  private readonly useCaseMap: Map<string, ProcessIncomingMessageUseCase>;

  constructor(
    private configService: ConfigService,
    private readonly useCaseFactory: ProcessIncomingMessageFactoryService,
  ) {
    const kafka = new Kafka({
      clientId: configService.get('kafka.clientId'),
      brokers: configService.get<string[]>('kafka.brokers'),
    });

    this.consumer = kafka.consumer({
      groupId: configService.get('kafka.groupId'),
    });

    this.useCaseMap = new Map();
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topics: [KafkaTopicsEnum.FacebookWebhook, KafkaTopicsEnum.ZaloWebhook],
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        try {
          let useCase = this.useCaseMap.get(topic);
          if (!useCase) {
            useCase = this.useCaseFactory.getUseCase(topic);
            this.useCaseMap.set(topic, useCase);
          }

          const value = message.value?.toString();
          if (!value) return;

          const data = JSON.parse(value);
          await useCase.execute(data);
        } catch (error) {
          console.error(`Error processing Kafka message for topic ${topic}:`, error);
        }
      },
    });
  }
}
