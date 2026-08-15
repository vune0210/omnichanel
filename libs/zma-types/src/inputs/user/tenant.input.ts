import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UserServiceCreateTenantGqlInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name!: string;

  @IsNotEmpty()
  @IsArray()
  @Field(() => [String])
  branchIds!: string[];

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  zaloAppId!: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  zaloAppSecret!: string;
}

@InputType()
export class UserServiceUpdateTenantGqlInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  id!: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name!: string;

  @IsNotEmpty()
  @IsArray()
  @Field(() => [String])
  branchIds!: string[];

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  zaloAppId!: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  zaloAppSecret!: string;
}

@InputType()
export class UserServiceDisableTenantGqlInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  id!: string;
}

export class UserServiceCreateTenantInput extends UserServiceCreateTenantGqlInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  userId!: string;
}

export class UserServiceUpdateTenantInput extends UserServiceUpdateTenantGqlInput {
  @IsNotEmpty()
  @IsString()
  userId!: string;
}
