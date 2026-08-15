import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { UserServiceUserType } from '../../types/user.type';

@InputType()
export class UserServiceCreateUserGqlInput {
  @Field(() => String)
  organizationId!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;

  @Field(() => String)
  firstName!: string;

  @Field(() => String)
  lastName!: string;

  @Field(() => String)
  phoneNumber!: string;
}

export class UserServiceCreateUserSubjectInput {
  @IsString()
  @IsOptional()
  organizationId?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  zaloId?: string;

  @IsString()
  @IsOptional()
  tenantId?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(UserServiceUserType)
  @IsOptional()
  type?: UserServiceUserType;
}

export class UserServiceCreateZaloUserSubjectInput {
  @IsString()
  @IsNotEmpty()
  zaloId!: string;

  @IsString()
  @IsNotEmpty()
  avatarUrl!: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  tenantId!: string;
}

export class UserServiceUpdateUserSubjectInput {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  resetToken?: string;

  @IsDate()
  @IsOptional()
  resetTokenExpiry?: Date;
}

export class UserServiceFindByEmailSubjectInput {
  @IsString()
  @IsNotEmpty()
  email!: string;
}

export class UserServiceFindByZaloIdAndTenantIdSubjectInput {
  @IsString()
  @IsNotEmpty()
  zaloId!: string;

  @IsString()
  @IsNotEmpty()
  tenantId!: string;
}

export class UserServiceUpdateProfileSubjectInput {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

export class FindZaloUsersByTenantIdInput {
  @IsString()
  @IsNotEmpty()
  tenantId!: string;
}
