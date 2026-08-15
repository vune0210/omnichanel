//channel
//channel-last-interact
//channel-pinned-message
//channel-user

//khi truy cap vao channel
async getChannelDetail(id: string, userId: string): Promise<ChannelDetail>

async getAllChannels(userId: string, pagination: Pagination): Promise<ChannelSummary[]>

//có thể update tên channel, mô tả, ảnh đại diện, hoặc onlyAdminCanSendMessage
async updateChannel(channelId: string, input: ChannelUpdateInput): Promise<boolean>

//danh sach user trong channel
async listChannelMember(channelId: string, pagination: Pagination): Promise<User[]>

//soft delete
async deleteChannel(channelId: string): Promise<boolean>

async createChannel(userId: string, input: ChannelInput, listUserId?: string[]): Promise<boolean>

//add user to channel
async addUserToChannel(channelId: string, targetId: string): Promise<boolean>

async removeUserFromChannel(channelId: string, targetId: string): Promise<boolean>

async leaveChannel(userId: string, channelId: string): Promise<boolean>

async updateUserRole(channelId: string, targetId: string, role: ChannelUserRole): Promise<boolean>

async updateLastInteract(channelId: string, userId: string, lastInteract: Date): Promise<boolean>

async pinMessage(channelId: string, messageId: number): Promise<boolean>

async unpinMessage(channelId: string, messageId: number): Promise<boolean>

async getPinnedMessages(channelId: string, pagination: Pagination): Promise<Message[]>


import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Exception } from '@zma-nestjs-omnichannel/zma-middlewares';
import { Pagination } from '@zma-nestjs-omnichannel/zma-types';
import { firstValueFrom } from 'rxjs';

import { IDataServices } from '../../core/abstracts';


import { ChannelDetail, ChannelSummary } from '../../core/models'
import { ChannelFactoryService } from './channel-factory.user-case.service';

@Injectable()
export class ChannelUseCase {
  constructor(
    @Inject('TEST_SERVICE') private client: ClientProxy,
    private dataServices: IDataServices,
    private factoryService: ChannelFactoryService,
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

  async getChannelDetail({ id, userId }: { id: string; userId: string }): Promise<ChannelDetail> {
    const tenantId = 'your_tenant_id_here';

    const channel = await this.dataServices.channelService.findById({ tenantId, id });
    if (!channel) {
      throw new Exception(`Channel with id ${id} not found`);
    }

    const channelUser = await this.dataServices.channelUserService.findOne({
      tenantId,
      find: { filter: { 
        channelId: id,
        userId: userId,
        isDeleted: false
      }},
    });

    return this.factoryService.transformToChannelDetail(channel, channelUser);
  }

  async getAllChannels(userId: string, pagination: Pagination): Promise<ChannelSummary[]> {
    const tenantId = 'your_tenant_id_here';
    const { skip, limit } = pagination;
    const channelUsers = await this.dataServices.channelUserService.findMany({
      tenantId,
      find: {
        filter: {
          userId: userId,
          isDeleted: false,
        },
      },
    });

    const channelIds = channelUsers.map((cu) => cu.channelId);
    const channels = await this.dataServices.channelService.findMany({
      tenantId,
      find: {
        filter: {
          _id: { $in: channelIds },
          isDeleted: false,
        },
      },
    });

    const channelLastInteracts = await this.dataServices.channelLastInteractService.findMany({
      tenantId,
      find: {
        filter: {
          channelId: { $in: channelIds },
        },
      },
    });

    //TODO: hoàn thiện ở đây


  }
}