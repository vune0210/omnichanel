import { uuidv7 } from 'uuidv7';

export class MessageEntity {
  id: string;
  tenantId: string;
  msgPlatformId?: string;
  refId?: string;
  clientPlatformId: string;
  platform: string;
  authorId: string;
  channelId: number = 123456;
  message?: string;
  attachments?: string[];
  msgType: string;
  timestamp: Date;
  
  constructor(partial?: Partial<MessageEntity>) {
    this.id = uuidv7();
    Object.assign(this, partial);
  }
}