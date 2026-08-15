import { Schema as NestSchema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IdUtils } from '@zma-nestjs-omnichannel/zma-utils';
import { Document, SchemaTypes } from 'mongoose';

import { FileStatus } from '../../../../core/types/enums';

export type FileDocument = FileEntity & Document;

@NestSchema({
  collection: 'files',
  toObject: {
    virtuals: true,
    versionKey: false,
  },
  timestamps: true,
})
export class FileEntity {
  @Prop({ type: SchemaTypes.UUID, default: () => IdUtils.uuidv7() })
  _id?: string;

  @Prop()
  name?: string;

  @Prop()
  fileName?: string;

  @Prop({ default: 0 })
  size?: number;

  @Prop({ required: true })
  extension: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ default: '' })
  key?: string;

  @Prop({ required: true })
  bucket: string;

  @Prop({ enum: FileStatus, default: FileStatus.PendingUpload })
  status: string;

  @Prop({ type: SchemaTypes.UUID, required: true })
  userId: string;

  @Prop()
  tempPresignedUrl?: string; // Temporary URL for file transfer between buckets

  @Prop({ default: false, type: Boolean })
  isDeleted?: boolean;

  @Prop({ default: false, type: Boolean })
  isDisabled?: boolean;

  @Prop({ type: SchemaTypes.Date })
  deletedAt?: Date;

  @Prop()
  contentHash?: string; // Added for deduplication purposes

  @Prop({ type: [String], default: [] })
  tags?: string[]; // Added for better file categorization
}

export const FileSchema = SchemaFactory.createForClass(FileEntity);
