import { ClientScyllaPagination } from '@zma-nestjs-omnichannel/zma-types';

import { MessageInput } from '../../../core/inputs';
import { Message } from '../../../core/models';

export interface IMessageInterface {
  //testMicroservice(): Promise<string>;
  saveUserMessage(
    { clientPlatformId, msgText, timestamp, msgPlatformId, attachmentsRaw, refId }: {
      clientPlatformId: string, // id khach hang tren nen tang
      msgText: string,
      timestamp: number,
      msgPlatformId: string, // id tin nhan tren nen tang
      attachmentsRaw?: Array<{ type: string; payload: { url: string } }>,
      refId?: string,
    }
  ): Promise<void>;

  addAgentMessage(input: MessageInput): Promise<boolean>;

  // markMessageAsDelivered({ clientPlatformId, watermark }: {
  //   clientPlatformId: string,
  //   watermark: number,
  // }): Promise<void>;

  // markMessageAsRead({ clientPlatformId, watermark }: {
  //   clientPlatformId: string,
  //   watermark: number,
  // }): Promise<void>;

  getMessagesByClient({ clientPlatformId, pagination }: {
    clientPlatformId: string,
    pagination: ClientScyllaPagination,
  }): Promise<Message[]>;
}