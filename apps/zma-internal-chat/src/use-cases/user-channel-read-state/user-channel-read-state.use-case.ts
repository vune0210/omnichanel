
// async getUserChannelReadState(userId: string, channelId: string): Promise<UserChannelReadState>

// async updateUserChannelReadState(userChannelReadStateInput: UserChannelReadStateInput): Promise<boolean>

// async deleteUserChannelReadState(userId: string, channelId: string): Promise<boolean>

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Exception } from '@zma-nestjs-omnichannel/zma-middlewares';
import { firstValueFrom } from 'rxjs';

import { IDataServices } from '../../core/abstracts';


import { UserChannelReadStateInput } from '../../core/inputs';
import { UserChannelReadState } from '../../core/models';
import { UserChannelReadStateFactoryService } from './user-channel-read-state-factory.user-case.service';


@Injectable()
export class UserChannelReadStateUseCase {
  constructor(
    @Inject('TEST_SERVICE') private client: ClientProxy,
    private dataServices: IDataServices,
    private factoryService: UserChannelReadStateFactoryService,
  ) {}

  async testMicroservice(): Promise<string> {
    const response = await firstValueFrom(
      this.client.send('sample', {
        body: {
          name: 'John Doe',
        },
      }),
    );

    return response;
  }

  async getUserChannelReadState(userId: string, channelId: string): Promise<UserChannelReadState> {
    const tenantId = 'your_tenant_id_here';
    const userChannelReadState = await this.dataServices.userChannelReadStateService.findOne({
      tenantId,
      find: {
        filter: {
          userId,
          channelId,
        },
      },
    });
    if (!userChannelReadState) {
      throw new Exception(`User channel read state not found`);
    }
    return this.factoryService.transform(userChannelReadState);
  }

  async updateUserChannelReadState(input: UserChannelReadStateInput): Promise<boolean> {
    const tenantId = 'your_tenant_id_here';
    const existingState = await this.dataServices.userChannelReadStateService.findOne({
      tenantId,
      find: {
        filter: {
          userId: input.userId,
          channelId: input.channelId,
        },
      },
    });

    if (!existingState) {
      throw new Exception(`User channel read state not found for userId: ${input.userId} and channelId: ${input.channelId}`);
    }

    const updateState = {
      ...input,
    };

    const entity = await this.dataServices.userChannelReadStateService.updateOne({
      tenantId,
      id: existingState._id,
      update: { item: updateState },
    });
    return !!entity;
  }
}