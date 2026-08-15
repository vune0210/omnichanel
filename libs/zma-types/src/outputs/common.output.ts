import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BooleanGqlOutput {
  @Field(() => Boolean)
  status!: boolean;
}

export class BooleanOutput extends BooleanGqlOutput {}
