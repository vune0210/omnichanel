import { Resolver, Query, Args } from '@nestjs/graphql';
import { Pagination } from '@zma-nestjs-omnichannel/zma-types';

import { Client } from '../../core/models';
import { ClientUseCase } from '../../use-cases/client/client.use-case';
import { PlatformEnum } from '../../core/types';

@Resolver(() => Client)
export class ClientResolver {
  constructor(private readonly useCase: ClientUseCase) {}

  @Query(() => [Client])
  async getAllClients(@Args('pagination') pagination: Pagination): Promise<Client[]> {
    return this.useCase.getAllClients(pagination);
  }

  @Query(() => Client)
  async getClient(
    @Args('clientPlatformId') clientPlatformId: string,
    @Args('platform', { type: () => PlatformEnum }) platform: PlatformEnum,
  ): Promise<Client> {
    return this.useCase.getClient({ clientPlatformId, platform });
  }

  @Query(() => [Client])
  async searchClients(
    @Args('pagination') pagination: Pagination,
    @Args('input') input: string,
  ): Promise<Client[]> {
    return this.useCase.searchClients(pagination, input);
  }
}
