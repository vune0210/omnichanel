import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ITenantGenericRepository,
  TenantMongoGenericRepository,
} from '@zma-nestjs-omnichannel/zma-repositories';
import { Model } from 'mongoose';

import { IDataServices } from '../../../core';

import { 
  ChannelDocument, 
  ChannelEntity, 
  ChannelPinnedMessagesDocument, 
  ChannelPinnedMessagesEntity, 
  ChannelUserDocument, 
  ChannelUserEntity, 
  UserChannelReadStateDocument, 
  UserChannelReadStateEntity,
  ChannelLastInteractDocument,
  ChannelLastInteractEntity,
 } from './entities';

@Injectable()
export class MongoDataServices implements IDataServices, OnApplicationBootstrap {
  channelService: ITenantGenericRepository<ChannelEntity>;
  channelPinnedMessagesService: ITenantGenericRepository<ChannelPinnedMessagesEntity>;
  channelUserService: ITenantGenericRepository<ChannelUserEntity>;
  userChannelReadStateService: ITenantGenericRepository<UserChannelReadStateEntity>;
  channelLastInteractService: ITenantGenericRepository<ChannelLastInteractEntity>;

  constructor(
    @InjectModel(ChannelEntity.name)
    private channelRepository: Model<ChannelDocument>,

    @InjectModel(ChannelPinnedMessagesEntity.name)
    private channelPinnedMessagesRepository: Model<ChannelPinnedMessagesDocument>,

    @InjectModel(ChannelUserEntity.name)
    private channelUserRepository: Model<ChannelUserDocument>,

    @InjectModel(UserChannelReadStateEntity.name)
    private userChannelReadStateRepository: Model<UserChannelReadStateDocument>,

    @InjectModel(ChannelLastInteractEntity.name)
    private channelLastInteractRepository: Model<ChannelLastInteractDocument>,
  ) {}

  onApplicationBootstrap() {
    this.channelService = new TenantMongoGenericRepository(this.channelRepository);
    this.channelPinnedMessagesService = new TenantMongoGenericRepository(this.channelPinnedMessagesRepository);
    this.channelUserService = new TenantMongoGenericRepository(this.channelUserRepository);
    this.userChannelReadStateService = new TenantMongoGenericRepository(this.userChannelReadStateRepository);
    this.channelLastInteractService = new TenantMongoGenericRepository(this.channelLastInteractRepository);
  }

}

