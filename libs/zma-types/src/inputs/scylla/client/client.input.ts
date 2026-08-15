import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min, IsInt, IsOptional, IsDate } from 'class-validator';

@InputType()
export class ClientScyllaPagination {
  @IsDate()
  @IsOptional()
  @Field(() => Date, { nullable: true })
  before?: Date;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  @Field(() => Int, { nullable: true })
  limit? = 10;
}
