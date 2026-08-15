import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { UserServiceUserStatus, UserServiceUserType } from '../../types/user.type';

registerEnumType(UserServiceUserType, { name: 'UserServiceUserType' });
registerEnumType(UserServiceUserStatus, { name: 'UserServiceUserStatus' });

@ObjectType()
class UserServiceSocialProvider {
  @Field(() => String)
  id!: string;

  @Field(() => String, { nullable: true })
  email?: string;
}

@ObjectType()
class UserServiceSocialProviders {
  @Field(() => UserServiceSocialProvider, { nullable: true })
  google?: UserServiceSocialProvider;

  @Field(() => UserServiceSocialProvider, { nullable: true })
  facebook?: UserServiceSocialProvider;
}

@ObjectType({ description: 'User' })
export class UserServiceUserGqlOutput {
  @Field(() => String, { name: 'id' })
  _id?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => String, { nullable: true })
  fullName?: string;

  @Field(() => String, { nullable: true })
  zaloId?: string;

  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @Field(() => String, { nullable: true })
  birthDate?: string;

  @Field(() => String, { nullable: true })
  gender?: string;

  @Field(() => String, { nullable: true })
  avatarUrl?: string;

  @Field(() => UserServiceUserType)
  type!: UserServiceUserType;

  @Field(() => UserServiceUserStatus)
  status!: UserServiceUserStatus;

  @Field(() => String, { nullable: true })
  tenantId?: string;

  @Field(() => String, { nullable: true })
  organizationId?: string;

  @Field(() => String, { nullable: true })
  createdAt?: string;

  @Field(() => String, { nullable: true })
  updatedAt?: string;
}

@ObjectType({ description: 'User' })
export class UserServiceUser extends UserServiceUserGqlOutput {
  @Field(() => UserServiceSocialProviders, { nullable: true })
  socialProviders?: UserServiceSocialProviders;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => String, { nullable: true })
  resetToken?: string;

  @Field(() => String, { nullable: true })
  resetTokenExpiry?: string;
}
