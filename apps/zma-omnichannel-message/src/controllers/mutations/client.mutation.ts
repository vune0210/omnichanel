import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PlatformEnum } from '../../core/types';
import { ClientUseCase } from '../../use-cases/client/client.use-case';

@Resolver()
export class ClientMutation {
  constructor(private useCase: ClientUseCase) {}
  private readonly logger = new Logger(ClientMutation.name);

  @Mutation(() => Boolean)
  async updateLastInteract(
    @Args('platformId') platformId: string,
    @Args('platform') platform: PlatformEnum,
    @Args('watermark') watermark: Date,
  ): Promise<boolean> {
    return this.useCase.updateLastInteract({
      clientPlatformId: platformId,
      platform,
      watermark,
    });
  }
}
