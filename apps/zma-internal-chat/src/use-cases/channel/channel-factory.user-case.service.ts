import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { ChannelEntity, ChannelUserEntity, ChannelLastInteractEntity } from '../../frameworks/data-services/mongo/entities';
import {ChannelDetail, ChannelSummary} from '../../core/models';

@Injectable()
export class ChannelFactoryService {
  // transform(entity: ChannelEntity): Channel {
  //   const channel: Channel = _.assign(entity);
  //   return channel;
  // }
  transformToChannelDetail(channel: ChannelEntity, channelUser: ChannelUserEntity): ChannelDetail {
    const channelDetail = _.assign(channel, {
      role: channelUser.role,
    })
    return channelDetail;
  }

  transformToChannelSummary(channel: ChannelEntity, channelLastInteract: ChannelLastInteractEntity): ChannelSummary {
    const channelSummary = _.assign(channel, {
      lastInteractedAt: channelLastInteract.lastInteractedAt,
    })
    return channelSummary;
  }
}
