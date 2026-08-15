import { platform } from 'os';

import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';

import { MessageInput } from '../../core/inputs';
import { Message } from '../../core/models/message.model';
import { PlatformEnum } from '../../core/types';
import { MessageUseCaseFactory } from '../../use-cases/message/factories/message.use-case.factory';
import { IMessageInterface } from '../../use-cases/message/interfaces/message.use-case.interface';

@Resolver()
export class MessageMutation {
  constructor(private useCaseFactory: MessageUseCaseFactory) {}
  private readonly logger = new Logger(MessageMutation.name);
  @Mutation(() => Boolean)
  async sendMessage(@Args('input') input: MessageInput): Promise<boolean> {
    const messageUseCase = this.useCaseFactory.get(input.platform as PlatformEnum);
    return messageUseCase.addAgentMessage(input);
  }
}
