import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'UserChannelReadState' })
export class UserChannelReadState {
  @Field(() => String, { name: 'id' })
  _id?: string;

  @Field()
  channelId: string;

  @Field()
  userId: string;
  
  @Field({ nullable: true })
  lastMessageId?: number;

  @Field({ nullable: true })
  lastDeliveredMessageId?: number;

  @Field({ nullable: true })
  readWatermark?: Date;

}
