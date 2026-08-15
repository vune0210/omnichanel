import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserServiceAddressGqlOutput {
  @Field(() => String, { name: 'id' })
  _id?: string;

  @Field()
  name!: string;

  @Field()
  address!: string;

  @Field()
  fullAddress!: string;

  @Field()
  province!: string;

  @Field()
  district!: string;

  @Field()
  ward!: string;

  @Field()
  phone!: string;

  @Field()
  isDefault!: boolean;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@ObjectType()
export class UserServiceAddress extends UserServiceAddressGqlOutput {}
