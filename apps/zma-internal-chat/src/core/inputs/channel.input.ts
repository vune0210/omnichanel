import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class ChannelInput {
    @IsString()
    @Field()
    type: string;
    
    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    name?: string;

    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    description?: string;
    
    @IsString()
    @IsOptional()
    @Field({ nullable: true })
    profilePicture?: string;

    @IsBoolean()
    @IsOptional()
    @Field({ nullable: true })
    onlyAdminCanSendMessage?: boolean;
}