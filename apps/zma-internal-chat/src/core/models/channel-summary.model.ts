import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'ChannelSummary' })
export class ChannelSummary {
  @Field(() => String, { name: 'id' })
  _id?: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field({ nullable: true })
  lastInteractedAt?: Date;
}
