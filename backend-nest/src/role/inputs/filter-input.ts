import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { FilterOperator } from 'src/role/eums/filter-operator.enum';
import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

@InputType()
export class FilterInput {
  @ValidateIf((fields: FilterInput) => fields.compareTo !== undefined)
  @IsEnum(FilterOperator)
  @IsNotEmpty()
  @Field(() => FilterOperator, { nullable: true })
  operator?: FilterOperator;

  @ValidateIf((fields: FilterInput) => fields.operator !== undefined)
  @IsString()
  @Field(() => String, { nullable: true })
  compareTo?: string;
}

registerEnumType(FilterOperator, { name: 'FilterOperator' });
