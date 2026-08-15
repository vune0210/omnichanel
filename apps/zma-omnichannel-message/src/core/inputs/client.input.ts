import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

import { PlatformEnum } from '../types';

@InputType()
export class ClientInput {
  @IsOptional()
  @IsEnum(PlatformEnum)
  @Field(() => PlatformEnum)
  platform: string;
}
