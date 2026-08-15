import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ChannelUseCase } from '../../use-cases/channel/channel.use-case';

@Injectable()
export class ChannelMemberGuard implements CanActivate {
  constructor(private readonly channelUseCase: ChannelUseCase) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { channelId } = ctx.getArgs();
    const { userId } = ctx.getContext().req.user;

    const role = await this.channelUseCase.getRoleUserInChannel(userId, channelId);
    if (role === undefined) {
      throw new ForbiddenException('You are not a member of this channel');
    }

    return true;
  }
}
