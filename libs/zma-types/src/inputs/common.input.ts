import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class FindByMultipleIdsGqlInput {
  @IsArray()
  @IsNotEmpty({ each: true })
  @Field(() => [String])
  ids!: string[];
}

@InputType()
export class FindByIdGqlInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  id!: string;
}

@InputType()
export class FindByUserIdGqlInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  userId!: string;
}

@InputType()
export class FindByOrganizationIdGqlInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  organizationId!: string;
}

export class FindByIdInput extends FindByIdGqlInput {}
export class FindByIdAndUserIdInput extends FindByIdGqlInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  userId!: string;
}
export class FindByMultipleIdsInput extends FindByMultipleIdsGqlInput {}
export class FindByMultipleIdsAndUserIdInput extends FindByMultipleIdsGqlInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  userId!: string;
}

export class FindByUserIdInput extends FindByUserIdGqlInput {}

export class FindByOrganizationIdInput extends FindByOrganizationIdGqlInput {}
