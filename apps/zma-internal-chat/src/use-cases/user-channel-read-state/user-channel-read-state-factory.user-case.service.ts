import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { UserChannelReadStateEntity } from '../../frameworks/data-services/mongo/entities';
import { UserChannelReadState } from '../../core/models';

@Injectable()
export class UserChannelReadStateFactoryService {
  transform(entity: UserChannelReadStateEntity): UserChannelReadState {
    const channel: UserChannelReadState = _.assign(entity);
    return channel;
  }
}