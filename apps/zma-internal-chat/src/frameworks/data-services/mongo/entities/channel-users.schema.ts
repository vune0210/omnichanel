import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IdUtils } from '@zma-nestjs-omnichannel/zma-utils';
import { Document, SchemaTypes } from 'mongoose';

export type ChannelUserDocument = ChannelUserEntity & Document;

@NestSchema({
  collection: 'channel_users',
  toObject: {
    virtuals: true,
    versionKey: false,
  },
  timestamps: true,
})
// schema for channel users in mongo
export class ChannelUserEntity {
  @Prop({ type: SchemaTypes.UUID, default: () => IdUtils.uuidv7() })
  _id?: string;

  @Prop({ type: SchemaTypes.UUID, required: true })
  channelId: string;

  @Prop()
  tenantId?: string;

  // @Prop({ required: true })
  // name: string;

  @Prop({ type: SchemaTypes.UUID, required: true })
  userId: string;

  @Prop()
  role?: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ChannelUserSchema = SchemaFactory.createForClass(ChannelUserEntity);
