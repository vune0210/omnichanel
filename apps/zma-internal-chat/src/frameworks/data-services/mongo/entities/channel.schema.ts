import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IdUtils } from '@zma-nestjs-omnichannel/zma-utils';
import { Document, SchemaTypes } from 'mongoose';

export type ChannelDocument = ChannelEntity & Document;

@NestSchema({
  collection: 'channels',
  toObject: {
    virtuals: true,
    versionKey: false,
  },
  timestamps: true,
})

// schema for channel in mongo
export class ChannelEntity {
  @Prop({ type: SchemaTypes.UUID, default: () => IdUtils.uuidv7() })
  _id?: string;

  @Prop()
  tenantId?: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  name?: string;

  @Prop()
  description?: string;

  @Prop()
  profilePicture?: string;

  @Prop()
  onlyAdminCanSendMessage?: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ChannelSchema = SchemaFactory.createForClass(ChannelEntity);
