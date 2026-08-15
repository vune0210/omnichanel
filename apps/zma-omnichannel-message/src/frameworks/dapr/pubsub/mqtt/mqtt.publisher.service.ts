import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DaprMqttPublisherService {
  private readonly daprUrl: string;
  private readonly pubsubName: string;

  constructor(private readonly config: ConfigService) {
    this.daprUrl = this.config.get<string>('NX_DAPR_HTTP_ENDPOINT', 'http://localhost:3501');
    this.pubsubName = this.config.get<string>('NX_DAPR_PUBSUB_MQTT_NAME', 'zma-omnichannel-mqtt-pubsub');
  }

  async publish(topic: string, payload: unknown): Promise<void> {
    const url = `${this.daprUrl}/v1.0/publish/${this.pubsubName}/${topic}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Publish via Dapr failed (${res.status}): ${res.statusText} ${text}`);
    }
  }
}
