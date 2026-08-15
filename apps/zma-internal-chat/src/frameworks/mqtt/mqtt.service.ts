import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, MqttClient } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: MqttClient;
  private readonly logger = new Logger(MqttService.name);
  private messageHandler: (topic: string, message: Buffer) => void = () => {
    //TODO
  };

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const broker = this.configService.get<string>('NX_MQTT_BROKER');

    this.client = connect(broker, {
      reconnectPeriod: 1000,
    });

    this.client.on('connect', () => {
      this.logger.log('✅ Connected to MQTT broker');
    });

    this.client.on('error', (err) => {
      this.logger.error('❌ MQTT Error:', err);
    });

    this.client.on('reconnect', () => {
      this.logger.warn('🔄 Reconnecting to MQTT broker...');
    });

    this.client.on('close', () => {
      this.logger.warn('🔌 MQTT connection closed');
    });

    this.client.on('message', (topic, message) => {
      const msgStr = message.toString();
      this.logger.log(`📥 MQTT Received on [${topic}]: ${msgStr}`);
      this.messageHandler(topic, message);
    });
  }

  onModuleDestroy() {
    this.client?.end();
  }

  publish(topic: string, payload: any) {
    const message = JSON.stringify(payload);
    this.logger.log(`📡 MQTT Publish → [${topic}]: ${message}`);
    this.client?.publish(topic, message);
  }

  subscribe(topic: string) {
    this.client?.subscribe(topic, (err) => {
      if (err) {
        this.logger.error(`❌ Failed to subscribe to [${topic}]`, err);
      } else {
        this.logger.log(`📶 Subscribed to [${topic}]`);
      }
    });
  }

  onMessage(handler: (topic: string, message: Buffer) => void) {
    this.messageHandler = handler;
  }
}
