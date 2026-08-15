import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class StorageServiceGenerateFileUrlsGqlInput {
  @IsArray()
  @IsNotEmpty({ each: true })
  @Field(() => [String], { defaultValue: [] })
  fileIds!: string[];
}

export class StorageServiceGenerateFileUrlsInput extends StorageServiceGenerateFileUrlsGqlInput {}

@InputType()
export class StorageServiceConfirmUploadedFilesGqlInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  fileId!: string;
}

@InputType()
export class StorageServiceConfirmUploadedFilesInput {
  @IsArray()
  @IsNotEmpty({ each: true })
  @Field(() => [StorageServiceConfirmUploadedFilesGqlInput], { defaultValue: [] })
  files!: StorageServiceConfirmUploadedFilesGqlInput[];

  @IsString()
  @IsNotEmpty()
  @Field()
  userId!: string;
}
