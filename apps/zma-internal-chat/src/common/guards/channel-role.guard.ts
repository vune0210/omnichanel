import { CanActivate, ExecutionContext, ForbiddenException, Injectable, mixin, Type } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ChannelUserRoleEnum } from '../../core/types';
import { ChannelUseCase } from '../../use-cases/channel/channel.use-case';

export function ChannelRoleGuard(requiredRole: 'MEMBER' | 'ADMIN' | 'OWNER'): Type<CanActivate> {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    constructor(private readonly channelUsecase: ChannelUseCase) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const ctx = GqlExecutionContext.create(context);
      const { req } = ctx.getContext();
      const { channelId } = ctx.getArgs();
      const userId = req.user.userId;

      const role = await this.channelUsecase.getRoleUserInChannel(userId, channelId);

      // Nếu yêu cầu là ADMIN, cho phép ADMIN và OWNER
      if (requiredRole === ChannelUserRoleEnum.Admin && (role !== ChannelUserRoleEnum.Admin && role !== ChannelUserRoleEnum.Owner)) {
        throw new ForbiddenException('Only admin or owner can perform this action');
      }

      // Nếu yêu cầu là OWNER, phải là OWNER
      if (requiredRole === ChannelUserRoleEnum.Owner && role !== ChannelUserRoleEnum.Owner) {
        throw new ForbiddenException('Only the channel owner can perform this action');
      }

      //req.user.role = role;
      return true;
    }
  }

  return mixin(RoleGuardMixin);
}
