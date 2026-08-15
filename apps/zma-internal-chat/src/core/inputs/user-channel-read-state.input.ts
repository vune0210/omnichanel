import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class UserChannelReadStateInput {
    @IsString()
    @Field()
    channelId: string;

    @IsString()
    @Field()
    userId: string;

    @IsInt()
    @IsOptional()
    @Field({ nullable: true })
    lastReadMessageId?: number;

    @IsInt()
    @IsOptional()
    @Field({ nullable: true })
    lastDeliveredMessageId?: number;

    @IsDate()
    @IsOptional()
    @Field({ nullable: true })
    readWatermark?: Date;
}