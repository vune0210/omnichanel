import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Message' })
export class Message {
  @Field()
  channelId: string;

  @Field()
  messageId?: number;

  @Field()
  senderId: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  message?: string;

  @Field(() => [String], { nullable: true })
  attachments?: string[];

  @Field({ nullable: true })
  replyTo?: string;

  @Field()
  createdAt: Date;

  @Field()
  isEdited: boolean;

  @Field({ nullable: true })
  editedAt?: Date;

  @Field()
  isDeleted: boolean;

  @Field({ nullable: true })
  deletedAt?: Date;
}
