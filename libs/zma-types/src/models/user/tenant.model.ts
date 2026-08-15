import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

import { UserServiceTenantBillingStatus, UserServiceTenantStatus } from '../../types/tenant.type';

registerEnumType(UserServiceTenantStatus, { name: 'UserServiceTenantStatus' });
registerEnumType(UserServiceTenantBillingStatus, { name: 'UserServiceTenantBillingStatus' });

@ObjectType()
export class UserServiceTenantGqlOutput {
  @Field(() => String, { name: 'id' })
  _id?: string;

  @Field()
  name!: string;

  @Field(() => UserServiceTenantStatus)
  status!: UserServiceTenantStatus;

  @Field(() => UserServiceTenantBillingStatus)
  billingStatus!: UserServiceTenantBillingStatus;

  @Field()
  organizationId!: string;

  @Field(() => [String], { nullable: true })
  branchIds?: string[];

  @Field()
  zaloAppId!: string;

  @Field()
  zaloAppSecret!: string;

  @Field({ nullable: true })
  createdAt?: string;

  @Field({ nullable: true })
  updatedAt?: string;
}

@ObjectType()
export class UserServiceTenant extends UserServiceTenantGqlOutput {}
