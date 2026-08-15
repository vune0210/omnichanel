import { Field, ObjectType } from '@nestjs/graphql';

//output cho graphql
@ObjectType({ description: 'Client' })
export class Client {
  @Field(() => String, { name: 'id' })
  _id?: string;

  @Field()
  platformId: string;

  @Field()
  channel: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field({ nullable: true })
  lastAgentInteract?: Date;

  @Field({ nullable: true })
  lastInteract?: Date;

  @Field({ nullable: true })
  lastDeliveredWatermark?: Date;

  @Field({ nullable: true })
  lastReadWatermark?: Date;
}
