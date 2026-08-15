import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DaprProducerService {
  private readonly logger = new Logger(DaprProducerService.name);
  private readonly daprUrl: string;
  private readonly pubsubName: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.daprUrl = this.configService.get<string>('DAPR_HTTP_ENDPOINT', 'http://localhost:3500');
    this.pubsubName = this.configService.get<string>('DAPR_PUBSUB_NAME', 'zma-omnichannel-consumer-kafka-pubsub');
  }

  async sendMessage(topic: string, payload: any): Promise<void> {
    try {
      const url = `${this.daprUrl}/v1.0/publish/${this.pubsubName}/${topic}`;
      this.logger.log(`Publishing message to topic: ${topic}`);
      
      await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );
      
      this.logger.log(`Successfully published message to topic: ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to publish message to topic ${topic}:`, error.message);
      throw error;
    }
  }
}