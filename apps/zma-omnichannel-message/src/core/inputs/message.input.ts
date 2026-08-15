import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

import { MessageTypeEnum, PlatformEnum } from '../types';

@InputType()
export class MessageInput {
  @Field()
  @IsString()
  clientPlatformId: string;

  @Field(() => PlatformEnum)
  @IsEnum(PlatformEnum)
  platform: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  message?: string;

  @Field(() => MessageTypeEnum, { defaultValue: MessageTypeEnum.Text })
  @IsEnum(MessageTypeEnum)
  @IsOptional()
  type?: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  @IsArray()
  @IsOptional()
  attachments?: string[];
}
