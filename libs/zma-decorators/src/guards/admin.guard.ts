import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { UserServiceUserType } from '@zma-nestjs-omnichannel/zma-types';
import { AuthenticatedUser } from '@zma-nestjs-omnichannel/zma-types/outputs/user';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  override getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = this.getRequest(context).user as AuthenticatedUser;
    if (user && user.type === UserServiceUserType.Admin) {
      return super.canActivate(context);
    }
    return false;
  }
}
