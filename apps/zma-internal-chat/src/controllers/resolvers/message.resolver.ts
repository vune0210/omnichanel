import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../common/decorators';
import { ChannelRoleGuard, ChannelMemberGuard } from '../../common/guards';
import { Message } from '../../core/models';
import { MessageUseCase } from '../../use-cases/message/message.use-case';
import { ChannelUserRoleEnum } from '../../core/types';

@Resolver(() => Message)
export class MessageResolver {
  constructor(private readonly messageUseCase: MessageUseCase) {}

  @Query(() => [Message])
  @UseGuards(AuthGuard('jwt'), ChannelMemberGuard)
  async getMessages(
    @CurrentUser('userId') userId: string,
    @Args('channelId') channelId: string,
    @Args('cursor', { nullable: true }) cursor?: number,
    @Args('limit', { nullable: true }) limit?: number,
    @Args('direction', { nullable: true }) direction?: 'before' | 'after',
  ): Promise<Message[]> {
    return this.messageUseCase.getAllMessages({ channelId, cursor, limit, direction });
  }
}
