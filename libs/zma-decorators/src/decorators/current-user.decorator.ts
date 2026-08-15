import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticatedUser } from '@zma-nestjs-omnichannel/zma-types/outputs/user';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const user = request.user as AuthenticatedUser;
    const acceptLanguage = request.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
    return {
      ...user,
      acceptLanguage,
    };
  },
);
