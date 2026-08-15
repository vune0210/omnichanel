import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientScyllaPagination } from '@zma-nestjs-omnichannel/zma-types';
import axios from 'axios';

import { IDataServices } from '../../../../core/abstracts';
import { MessageInput } from '../../../../core/inputs';
import { Message } from '../../../../core/models/message.model';
import { MessageTypeEnum, PlatformEnum } from '../../../../core/types';
import { MessageEntity } from '../../../../frameworks/data-services/scylla/entities';
//import { MqttService } from '../../../../frameworks/mqtt-deprecated/mqtt.service';
import { IMessageInterface } from '../../interfaces/message.use-case.interface';
import { MessageFactoryService } from '../../message-factory.user-case.service';
import { DaprMqttPublisherService } from '../../../../frameworks/dapr/pubsub/mqtt/mqtt.publisher.service';

@Injectable()
export class MessageUseCaseInstagram implements IMessageInterface {
  constructor(
    @Inject('IDataServices') private dataServices: IDataServices,
    private factoryService: MessageFactoryService,
    private configService: ConfigService,
    //private mqttService: MqttService,
    private daprMqtt: DaprMqttPublisherService,
  ) {}

  async saveUserMessage({ clientPlatformId, msgText, timestamp, msgPlatformId, attachmentsRaw, refId }: {
    clientPlatformId: string, //id khach hang tren nen tang
    msgText: string,
    timestamp: number,
    msgPlatformId: string, //id tin nhan tren nen tang
    attachmentsRaw?: Array<{ type: string; payload: { url: string } }>,
    refId?: string,
  }) {
    const tenantId = 'your_tenant_id_here';
    const attachments = attachmentsRaw?.map((a) => a.payload.url) || [];
    let type: MessageTypeEnum = MessageTypeEnum.Text;
    if (attachmentsRaw?.length) {
      const firstType = attachmentsRaw[0].type.toUpperCase();
      type = [MessageTypeEnum.Image, MessageTypeEnum.Video, MessageTypeEnum.File].includes(
        firstType as any,
      )
        ? (firstType as MessageTypeEnum)
        : MessageTypeEnum.File;
    }

    const message = new MessageEntity({
      tenantId,
      clientPlatformId,
      platform: PlatformEnum.Instagram,
      authorId: 'user',
      message: msgText,
      msgPlatformId,
      refId: refId ?? null,
      attachments,
      msgType: type,
      timestamp: new Date(timestamp),
    });
    await this.dataServices.messageService.save(message);
    console.log('Message saved with ID:', message.id);

    // Publish message to MQTT
    const payload = {
      ...message,
      timestamp: message.timestamp.getTime(),
    };
    const topic = `chat/${message.platform}/${message.clientPlatformId}/newMessage`;
    console.log('Publishing MQTT message to topic:', topic);
    //this.mqttService.publish(topic, payload);
    this.daprMqtt.publish(topic, payload);
  }

  async addAgentMessage(input: MessageInput): Promise<boolean> {
    const {
      clientPlatformId,
      platform = PlatformEnum.Instagram,
      message,
      type = MessageTypeEnum.Text,
      attachments,
    } = input;
    const tenantId = 'your_tenant_id_here';
    const pageAccessToken = this.configService.get<string>('NX_INSTAGRAM_PAGE_ACCESS_TOKEN');
    const responseUrl = `https://graph.instagram.com/v23.0/me/messages?access_token=${pageAccessToken}`;

    try {
      let msgPlatformId: string | null = null;
      if (type === MessageTypeEnum.Text && message) {
        const res = await axios.post(responseUrl, {
          recipient: { id: clientPlatformId },
          message: { text: message },
        });
        msgPlatformId = res.data.message_id;
      } else if (attachments?.length) {
        for (const url of attachments) {
          const res = await axios.post(responseUrl, {
            recipient: { id: clientPlatformId },
            message: {
              attachment: {
                type,
                payload: { url, is_reusable: true },
              },
            },
          });
          msgPlatformId = res.data.message_id;
        }
      } else {
        return false;
      }
      
      const timestamp = new Date();
      const entity = new MessageEntity({
        tenantId,
        clientPlatformId,
        platform,
        authorId: 'agent',
        message: message ?? '',
        msgPlatformId,
        refId: null,
        attachments: attachments ?? [],
        msgType: type,
        timestamp,
      });
      const saved = await this.dataServices.messageService.save(entity);
      await this.dataServices.clientService.updateMany({
        tenantId,
        filter: { platformId: clientPlatformId, channel: platform },
        item: { lastAgentInteract: timestamp },
      });
      return !!saved;
    } catch (err) {
      console.error('❌ Gửi tin nhắn tới instagram thất bại:', err.response?.data || err.message);
      return false;
    }
  }

  async getMessagesByClient({
    clientPlatformId,
    pagination,
  }: {
    clientPlatformId: string;
    pagination?: ClientScyllaPagination;
  }): Promise<Message[]> {
    const tenantId = 'your_tenant_id_here';
    const entities = await this.dataServices.messageService.findByClientPlatformId({
      tenantId,
      clientPlatformId,
      platform: PlatformEnum.Instagram,
      pagination,
    });
    return entities.map((e) => this.factoryService.transform(e));
  }
}