import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IdUtils } from '@zma-nestjs-omnichannel/zma-utils';
import { Document, SchemaTypes } from 'mongoose';

export type ChannelLastInteractDocument = ChannelLastInteractEntity & Document;

@NestSchema({
  collection: 'channel_last_interact',
  toObject: {
    virtuals: true,
    versionKey: false,
  },
  timestamps: true,
})

// schema for channel last interact in mongo
export class ChannelLastInteractEntity {
  @Prop({ type: SchemaTypes.UUID, default: () => IdUtils.uuidv7() })
  _id?: string;

  @Prop({ type: SchemaTypes.UUID})
  channelId: string;

  @Prop()
  tenantId?: string;

  @Prop({ type: Date, default: () => new Date() })
  lastInteractedAt: Date;

  // @Prop({ default: false })
  // isDeleted: boolean;
}

export const ChannelLastInteractSchema = SchemaFactory.createForClass(ChannelLastInteractEntity);
