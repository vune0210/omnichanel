import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IdUtils } from '@zma-nestjs-omnichannel/zma-utils';
import { Document, SchemaTypes } from 'mongoose';

export type UserChannelReadStateDocument = UserChannelReadStateEntity & Document;

@NestSchema({
  collection: 'user_channel_read_states',
  _id: false,
  toObject: {
    virtuals: true,
    versionKey: false,
  },
  timestamps: true,
})

// schema for user channel read states in mongo
export class UserChannelReadStateEntity {
  @Prop({ type: SchemaTypes.UUID, default: () => IdUtils.uuidv7() })
  _id: string;

  @Prop({ type: SchemaTypes.UUID, required: true })
  channelId: string;

  @Prop()
  tenantId?: string;

  @Prop({ type: SchemaTypes.UUID, required: true })
  userId: string;

  @Prop()
  lastReadMessageId?: number;

  @Prop()
  lastDeliveredMessageId?: number;

  @Prop({ type: Date })
  readWatermark?: Date;
}

export const UserChannelReadStateSchema = SchemaFactory.createForClass(UserChannelReadStateEntity);
