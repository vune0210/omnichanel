import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { MessageTypeEnum } from '../types';

@InputType()
export class MessageInput {
    @IsString()
    @Field()
    channelId: string;

    @IsString()
    @Field()
    senderId: string;

    @IsEnum(MessageTypeEnum)
    @Field(() => MessageTypeEnum)
    type: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    message?: string;

    @IsString()
    @IsArray()
    @IsOptional()
    @Field(() => [String], { nullable: true })
    attachments?: string[];

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    replyTo?: string;
}