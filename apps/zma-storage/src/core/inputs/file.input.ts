import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

@InputType()
export class FileInput {
  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  fileId: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  mimeType?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  extension?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  address?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  workingHour?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  lunchBreak?: string;

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  @Field(() => [String], { nullable: true })
  locations: string[];

  @IsOptional()
  @IsString()
  @Field()
  description?: string;

  @IsOptional()
  @IsInt()
  @Field()
  totalEmployees?: number;
}
