import { Field, ObjectType } from '@nestjs/graphql';

//output cho graphql
@ObjectType({ description: 'ChannelLastInteract' })
export class ChannelLastInteract {
  @Field(() => String)
  channelId: string;

  @Field(() => Date, { defaultValue: () => new Date() })
  lastInteractedAt?: Date;
}
