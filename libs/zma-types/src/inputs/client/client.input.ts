import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Platform } from '../../enums/platform.enum';

@InputType()
export class ClientServiceCheckOrCreateGqlInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  @IsEnum(Platform)
  platform!: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  platformId!: string;

  @IsString()
  @IsOptional()
  @Field()
  name?: string;
}

export class ClientServiceCheckOrCreateInput extends ClientServiceCheckOrCreateGqlInput {}
