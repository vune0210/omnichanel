import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UserServiceCreateAddressGqlInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  address!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  fullAddress!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  province!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  district!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  ward!: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  phone!: string;
}

@InputType()
export class UserServiceUpdateAddressGqlInput extends UserServiceCreateAddressGqlInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  id!: string;
}

@InputType()
export class UserServiceUpdateDefaultGqlInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  id!: string;
}
