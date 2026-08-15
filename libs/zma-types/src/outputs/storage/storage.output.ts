import { Field, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@ObjectType({ description: 'File' })
export class StorageServiceGenerateFileUrlsGqlOutput {
  @Field(() => String)
  fileId!: string;

  @Field(() => String)
  url!: string;
}

export class StorageServiceGenerateFileUrlsOutput extends StorageServiceGenerateFileUrlsGqlOutput {}

@ObjectType()
export class ConfirmUploadedFilesGqlOutput {
  @IsString()
  @Field()
  fileId!: string;
}

export class ConfirmUploadedFilesOutput extends ConfirmUploadedFilesGqlOutput {}
