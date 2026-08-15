import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IdUtils } from '@zma-nestjs-omnichannel/zma-utils';
import { Document, SchemaTypes } from 'mongoose';

export type ClientDocument = ClientEntity & Document;

@NestSchema({
  collection: 'clients',
  toObject: {
    virtuals: true,
    versionKey: false,
  },
  timestamps: true,
})

// schema for client in mongo
export class ClientEntity {
  @Prop({ type: SchemaTypes.UUID, default: () => IdUtils.uuidv7() })
  _id?: string;

  @Prop({ required: true })
  platformId: string;

  @Prop({ required: true })
  channel: string;

  @Prop({ nullable: true })
  firstName?: string;

  @Prop({ nullable: true })
  lastName?: string;

  @Prop({ nullable: true })
  profilePicture?: string;

  @Prop({ nullable: true })
  lastAgentInteract?: Date;

  @Prop({ nullable: true })
  lastInteract?: Date;

  @Prop({ nullable: true })
  lastDeliveredWatermark?: Date;

  @Prop({ nullable: true })
  lastReadWatermark?: Date;

  @Prop({ required: true, index: true })
  tenantId: string;
}

export const ClientSchema = SchemaFactory.createForClass(ClientEntity);