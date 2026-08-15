import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class StorageServiceConfirmUploadedFilesGqlInput {
  @IsString()
  @Field()
  fileId: string;

  @IsString()
  @Field()
  mimeType: string;
}
