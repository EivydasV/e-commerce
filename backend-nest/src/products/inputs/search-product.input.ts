import { InputType, registerEnumType } from '@nestjs/graphql';
import { SearchOperatorsEnum } from '../../elasticsearch/enums/search-operators.enum';
import { SearchInput } from '../../elasticsearch/inputs/search.input';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class SearchProductInput {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SearchInput)
  queries: SearchInput[];
}

registerEnumType(SearchOperatorsEnum, {
  name: 'Operators',
});
