import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'ChannelDetail' })
export class ChannelDetail {
  @Field(() => String, { name: 'id' })
  _id?: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  name?: string;
  
  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field({ nullable: true })
  onlyAdminsCanSendMessage?: boolean;

  @Field({ nullable: true })
  role?: string;
}
