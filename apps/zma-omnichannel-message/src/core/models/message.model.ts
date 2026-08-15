import { Field, ObjectType } from '@nestjs/graphql';

import { MessageTypeEnum } from '../types';

//store in scylladb
@ObjectType({ description: 'Message' })
export class Message {
  @Field(() => String)
  id: string;

  @Field({ nullable: true })
  msgPlatformId?: string;

  @Field({ nullable: true })
  refId?: string;

  @Field()
  clientPlatformId: string;

  @Field()
  authorId: string;

  @Field()
  channelId: number;

  @Field({ nullable: true })
  message?: string;

  @Field(() => [String], { nullable: true })
  attachments?: string[];

  @Field(() => MessageTypeEnum)
  msgType: string;

  @Field()
  timestamp: Date;
}
