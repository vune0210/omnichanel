import { Injectable } from '@nestjs/common';

import { IDataServices } from '../../../core/';
import { ITenantMessageRepository } from '../../../core/abstracts/tenant-message-repository.abstract';

import { ScyllaMessageRepository } from './repositories/message.repository';

@Injectable()
export class ScyllaDataServices implements IDataServices {
  messageService: ITenantMessageRepository;

  constructor(messageRepo: ScyllaMessageRepository) {
    this.messageService = messageRepo;
  }
}
