import { Field, InputType } from '@nestjs/graphql';
import { FilterInput } from 'src/role/inputs/filter-input';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class QueryFilterInput {
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @ValidateIf((fields) => fields.filter !== undefined)
  @Field(() => String, { nullable: true })
  field?: string;

  @ValidateIf((fields) => fields.field !== undefined)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FilterInput)
  @Field(() => FilterInput, { nullable: true })
  filter?: FilterInput;
}
