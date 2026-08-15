import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IDataServices } from '../../../core';

import { 
  ChannelEntity, 
  ChannelPinnedMessagesEntity, 
  ChannelPinnedMessagesSchema, 
  ChannelSchema, 
  ChannelUserEntity, 
  ChannelUserSchema, 
  UserChannelReadStateEntity, 
  UserChannelReadStateSchema,
  ChannelLastInteractEntity,
  ChannelLastInteractSchema,  
} from './entities';

import { MongoDataServices } from './mongo-data-services.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ChannelEntity.name, schema: ChannelSchema }]),
    MongooseModule.forFeature([{ name: ChannelPinnedMessagesEntity.name, schema: ChannelPinnedMessagesSchema }]),
    MongooseModule.forFeature([{ name: ChannelUserEntity.name, schema: ChannelUserSchema }]),
    MongooseModule.forFeature([{ name: UserChannelReadStateEntity.name, schema: UserChannelReadStateSchema }]),
    MongooseModule.forFeature([{ name: ChannelLastInteractEntity.name, schema: ChannelLastInteractSchema }]),
  ],
  providers: [
    {
      provide: IDataServices, 
      useClass: MongoDataServices,
    },
  ],
  exports: [IDataServices],
})
export class MongoDataServicesModule {}
