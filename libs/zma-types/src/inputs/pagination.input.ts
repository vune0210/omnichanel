import { Field, InputType, Int } from '@nestjs/graphql';
import { Max, Min, IsInt, IsOptional } from 'class-validator';

@InputType()
export class Pagination {
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Field(() => Int, { nullable: true })
  skip? = 0;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(50)
  @Field(() => Int, { nullable: true })
  limit? = 10;
}
