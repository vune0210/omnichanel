import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean } from 'class-validator';

@ObjectType()
export class ClientServiceCheckOrCreateGqlOutput {
  @IsBoolean()
  @Field()
  ok!: boolean;
}

export class ClientServiceCheckOrCreateOutput extends ClientServiceCheckOrCreateGqlOutput {}
