import { Field, HideField, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, Max } from 'class-validator';
import { documentLimitConstant } from '../../core/constants/document-limit.constant';

@InputType()
export class OffsetPaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @IsPositive()
  @IsOptional()
  page: number = 1;

  @Field(() => Int, { defaultValue: 20 })
  @IsInt()
  @IsPositive()
  @Max(100)
  @IsOptional()
  perPage: number = 20;

  @HideField()
  get skip() {
    return (this.page - 1) * this.perPage;
  }

  @HideField()
  get isLimitReached() {
    return this.perPage * this.page > documentLimitConstant;
  }
}
