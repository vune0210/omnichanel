import { ClientScyllaPagination } from '@zma-nestjs-omnichannel/zma-types';

import { MessageEntity } from '../../frameworks/data-services/scylla/entities';
import { PlatformEnum } from '../types';

// khả năng phải chuyển qua libs
export abstract class ITenantMessageRepository {
  // abstract save(tenantId: string, item: MessageEntity): Promise<void>;
  // abstract findByClientPlatformId(clientPlatformId: string, platform: string): Promise<MessageEntity[]>;

  abstract save(item: MessageEntity): Promise<boolean>;

  abstract findByClientPlatformId( {
    tenantId,
    clientPlatformId,
    platform,
    pagination,
  }: {
    tenantId: string,
    clientPlatformId: string,
    platform: PlatformEnum,
    pagination: ClientScyllaPagination,
  }): Promise<MessageEntity[]>;

  // abstract markMessageAsDelivered( {
  //   tenantId, 
  //   clientPlatformId, 
  //   platform, 
  //   watermark, 
  //   deliveredAt
  // }: {  
  //   tenantId: string,
  //   clientPlatformId: string,
  //   platform: PlatformEnum,
  //   watermark: number,
  //   deliveredAt: Date,
  // }): Promise<void>;

  // abstract markMessageAsRead( {
  //   tenantId,
  //   clientPlatformId,
  //   platform,
  //   watermark,
  //   readAt
  // }: {
  //   tenantId: string,
  //   clientPlatformId: string,
  //   platform: PlatformEnum,
  //   watermark: number,
  //   readAt: Date,
  // }): Promise<void>;
}
