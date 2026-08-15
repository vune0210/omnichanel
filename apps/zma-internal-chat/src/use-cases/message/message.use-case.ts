//load tin nhắn R
//nhắn tin C
//xóa tin nhắn D
//sửa tin nhắn U

// async getMessage(channelId: string, id: number): Promise<Message>

// async getMessages(channelId: string, ids: number[]): Promise<Message[]>

// async getAllMessages(channelId: string, cursor: number, limit: number, direction: boolean): Promise<Message[]>

// async sendMessage(channelId: string, message: MessageInput): Promise<boolean>

// async editMessage(channelId: string, userId: number, messageId: number, message: string): Promise<boolean>

// async deleteMessage(channelId: string, userId: number, messageId: number): Promise<boolean>


import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Exception } from '@zma-nestjs-omnichannel/zma-middlewares';
import { firstValueFrom } from 'rxjs';

import { IDataServices } from '../../core/abstracts';

import { MessageInput } from '../../core/inputs';
import { Message } from '../../core/models';
import { MessageFactoryService } from './message-factory.user-case.service';


@Injectable()
export class MessageUseCase {
  constructor(
    @Inject('TEST_SERVICE') private client: ClientProxy,
    private dataServices: IDataServices,
    private factoryService: MessageFactoryService,
  ) {}

  async testMicroservice(): Promise<string> {
    const response = await firstValueFrom(
      this.client.send('sample', {
        body: {
          name: 'John Doe',
        },
      }),
    );

    return response;
  }

  async getMessage(channelId: string, id: number): Promise<Message> {
    const tenantId = 'your_tenant_id_here';
    const messageEntity = await this.dataServices.messageService.getMessageById({tenantId, channelId, id});
    if (!messageEntity) {
      throw new Exception(`Message with id ${id} not found in channel ${channelId}`);
    }
    return this.factoryService.transform(messageEntity);
  }

  async getMessages(channelId: string, ids: number[]): Promise<Message[]> {
    const tenantId = 'your_tenant_id_here';
    const messageEntities = await this.dataServices.messageService.getMessagesByIds({tenantId, channelId, ids});
    return messageEntities.map((entity) => this.factoryService.transform(entity));
  }

  async getAllMessages(channelId: string, cursor: number, limit: number, direction: 'before' | 'after'): Promise<Message[]> {
    const tenantId = 'your_tenant_id_here';
    const messages = await this.dataServices.messageService.getAllMessages({tenantId, channelId, cursor, limit, direction});
    return messages.map((entity) => this.factoryService.transform(entity));
  }

  async sendMessage(input: MessageInput): Promise<boolean> {
    const tenantId = 'your_tenant_id_here';

    const newMessage = {
      ...input,
      channelId: input.channelId,
      tenantId,
      createdAt: new Date(),
      isEdited: false,
      editedAt: null,
      isDeleted: false,
      deletedAt: null,
    };
    return this.dataServices.messageService.save(newMessage);
  }

  async editMessage(channelId: string, userId: string, id: number, newContent: string): Promise<boolean> {
    const tenantId = 'your_tenant_id_here';
    const entity = await this.dataServices.messageService.getMessageById({ tenantId, channelId, id });
    if (!entity) {
      throw new Exception(`Message with id ${id} not found in channel ${channelId}`);
    }
    if (entity.senderId !== userId) {
      throw new Exception(`User ${userId} is not authorized to edit this message`);
    }
    return this.dataServices.messageService.editMessage({ tenantId, channelId, id, newContent });
  }

  async deleteMessage(channelId: string, userId: string, id: number): Promise<boolean> {
    const tenantId = 'your_tenant_id_here';
    const entity = await this.dataServices.messageService.getMessageById({ tenantId, channelId, id });
    if (!entity) {
      throw new Exception(`Message with id ${id} not found in channel ${channelId}`);
    }
    if (entity.senderId !== userId) {
      throw new Exception(`User ${userId} is not authorized to delete this message`);
    }
    return this.dataServices.messageService.deleteMessage({ tenantId, channelId, id });
  }

  async adminDeleteMessage(channelId: string, id: number): Promise<boolean> {
    const tenantId = 'your_tenant_id_here';
    const entity = await this.dataServices.messageService.getMessageById({ tenantId, channelId, id });
    if (!entity) {
      throw new Exception(`Message with id ${id} not found in channel ${channelId}`);
    }
    return this.dataServices.messageService.deleteMessage({ tenantId, channelId, id });
  }
}
