import { Resolver, Query, Args } from '@nestjs/graphql';
import { ClientScyllaPagination } from '@zma-nestjs-omnichannel/zma-types';

import { Message } from '../../core/models/message.model';
import { PlatformEnum } from '../../core/types';
import { MessageUseCaseFactory } from '../../use-cases/message/factories/message.use-case.factory';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly useCaseFactory: MessageUseCaseFactory) {}

  @Query(() => [Message])
  async getMessagesByClient(
    @Args('platform', { type: () => PlatformEnum }) platform: PlatformEnum,
    @Args('clientPlatformId') clientPlatformId: string,
    @Args('pagination') pagination: ClientScyllaPagination,
  ): Promise<Message[]> {
    const messageUseCase = this.useCaseFactory.get(platform);
    return messageUseCase.getMessagesByClient({ clientPlatformId, pagination });
  }
}