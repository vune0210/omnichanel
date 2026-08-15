import { ITenantGenericRepository } from '@zma-nestjs-omnichannel/zma-repositories';

import { ChannelEntity, ChannelLastInteractEntity, ChannelPinnedMessageEntity, ChannelUserEntity, UserChannelReadStateEntity } from '../../frameworks/data-services/mongo/entities';

import { ITenantMessageRepository } from './tenant-message-repository.abstract'

export abstract class IDataServices {
  abstract channelService?: ITenantGenericRepository<ChannelEntity>;
  abstract channelPinnedMessagesService?: ITenantGenericRepository<ChannelPinnedMessageEntity>;
  abstract channelUserService?: ITenantGenericRepository<ChannelUserEntity>;
  abstract userChannelReadStateService?: ITenantGenericRepository<UserChannelReadStateEntity>;
  abstract channelLastInteractService?: ITenantGenericRepository<ChannelLastInteractEntity>;
  abstract messageService?: ITenantMessageRepository;
}
