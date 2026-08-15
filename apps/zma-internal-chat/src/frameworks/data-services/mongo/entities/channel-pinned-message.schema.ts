import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IdUtils } from '@zma-nestjs-omnichannel/zma-utils';
import { Document, SchemaTypes } from 'mongoose';

export type ChannelPinnedMessageDocument = ChannelPinnedMessageEntity & Document;

@NestSchema({
  collection: 'channel_pinned_messages',
  _id: false,
  toObject: {
    virtuals: true,
    versionKey: false,
  },
  timestamps: true,
})

// schema for channel pinned messages in mongo
export class ChannelPinnedMessageEntity {
  @Prop({ type: SchemaTypes.UUID, default: () => IdUtils.uuidv7() })
  _id?: string;

  @Prop({ type: SchemaTypes.UUID})
  channelId: string;

  @Prop()
  tenantId?: string;

  @Prop()
  messageId: number;

  @Prop({ type: Date, default: () => new Date() })
  pinnedAt: Date;

  @Prop({ type: SchemaTypes.UUID, required: true })
  pinnedBy: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ChannelPinnedMessageSchema = SchemaFactory.createForClass(ChannelPinnedMessageEntity);
