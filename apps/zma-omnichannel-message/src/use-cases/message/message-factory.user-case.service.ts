import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { Message } from '../../core/models';
import { MessageEntity } from '../../frameworks/data-services/scylla/entities';

@Injectable()
export class MessageFactoryService {
  transform(entity: MessageEntity): Message {
    const message: Message = _.assign(entity);
    return message;
  }
}