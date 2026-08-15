import { Injectable } from '@nestjs/common';

import { IDataServices } from '../../../core';

import { ScyllaMessageRepository, ScyllaMessageReactionRepository } from './repositories';

@Injectable()
export class ScyllaDataServices implements IDataServices {
  messageService: ScyllaMessageRepository;
  messageReactionService: ScyllaMessageReactionRepository;
  constructor(messageRepo: ScyllaMessageRepository, messageReactionRepo: ScyllaMessageReactionRepository) {
    this.messageService = messageRepo;
    this.messageReactionService = messageReactionRepo;
  }
}
