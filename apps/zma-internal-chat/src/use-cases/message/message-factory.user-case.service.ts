import { Injectable } from '@nestjs/common';
import _ from 'lodash';

import { MessageEntity } from '../../frameworks/data-services/scylla/entities';
import { Message } from '../../core/models';

@Injectable()
export class MessageFactoryService {
  transform(entity: MessageEntity): Message {
    const message: Message = _.assign(entity);
    return message;
  }
}