import { Field, InputType } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';

@InputType()
export class StorageServicePresignedUrlGqlInput {
  @IsString()
  @MaxLength(255)
  @Field(() => String)
  fileName: string;

  @IsString()
  @MaxLength(100)
  @Field(() => String)
  mimeType: string;
}
