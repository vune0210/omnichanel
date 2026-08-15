import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private producer: Producer;
  private kafka: Kafka;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: configService.get('kafka.clientId'),
      brokers: configService.get<string[]>('kafka.brokers'),
    });

    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    // 1. Tạo các topic nếu chưa có
    // const admin = this.kafka.admin();
    // await admin.connect();
    // await admin.createTopics({
    //   topics: [
    //     { topic: 'facebook_message_received', numPartitions: 1, replicationFactor: 1 },
    //     { topic: 'facebook_message_delivered', numPartitions: 1, replicationFactor: 1 },
    //     { topic: 'facebook_message_read', numPartitions: 1, replicationFactor: 1 },
    //     { topic: 'zalo_message_received', numPartitions: 1, replicationFactor: 1 },
    //     { topic: 'zalo_message_delivered', numPartitions: 1, replicationFactor: 1 },
    //     { topic: 'zalo_message_read', numPartitions: 1, replicationFactor: 1 },
    //   ],
    //   waitForLeaders: true,
    // });
    // await admin.disconnect();

    // 2. Kết nối producer như cũ
    await this.producer.connect();
  }

  async sendMessage(topic: string, payload: any) {
    await this.producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(payload),
        },
      ],
    });
  }

}
