import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientScyllaPagination, Pagination } from '@zma-nestjs-omnichannel/zma-types';

import { IDataServices } from '../../../../core';
import { MessageInput } from '../../../../core/inputs';
import { Message } from '../../../../core/models/message.model';
import { PlatformEnum } from '../../../../core/types';
import { IMessageInterface } from '../../interfaces/message.use-case.interface';
import { MessageFactoryService } from '../../message-factory.user-case.service';

@Injectable()
export class MessageUseCaseZalo implements IMessageInterface {
  constructor(
    //@Inject('TEST_SERVICE') private client: ClientProxy,
    private dataServices: IDataServices,
    private factoryService: MessageFactoryService,
    private configService: ConfigService,
  ) {}

  // async testMicroservice(): Promise<string> {
  //   const response = await firstValueFrom(
  //     this.client.send('sample', {
  //       body: {
  //         name: 'hello world',
  //       },
  //     }),
  //   );

  //   return response;
  // }

  async saveUserMessage({
    clientPlatformId,
    msgText,
    timestamp,
    msgPlatformId,
    attachmentsRaw,
  }: {
    clientPlatformId: string; //id khach hang tren nen tang
    msgText: string;
    timestamp: number;
    msgPlatformId: string; //id tin nhan tren nen tang
    attachmentsRaw?: Array<{ type: string; payload: { url: string } }>;
  }) {
    console.log('Hello world');
  }

  async addAgentMessage(input: MessageInput) {
    console.log('Hello world');
    return true;
  }

  // async markMessageAsDelivered({ clientPlatformId, watermark }: {
  //   clientPlatformId: string,
  //   watermark: number,
  // }) {
  //   console.log('Hello world');
  // }

  // async markMessageAsRead({ clientPlatformId, watermark }: {
  //   clientPlatformId: string,
  //   watermark: number,
  // }) {
  //   console.log('Hello world');
  // }

  async getMessagesByClient({ clientPlatformId, pagination }: {
    clientPlatformId: string,
    pagination?: ClientScyllaPagination,
  }): Promise<Message[]> {
    const tenantId = 'your_tenant_id_here';
    const entities = await this.dataServices.messageService.findByClientPlatformId({
      tenantId,
      clientPlatformId,
      platform: PlatformEnum.Zalo,
      pagination,
    });
    return entities.map((e) => this.factoryService.transform(e));
  }
}
