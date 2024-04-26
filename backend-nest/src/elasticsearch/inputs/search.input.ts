import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SearchOperatorsEnum } from '../enums/search-operators.enum';
import { InputType } from '@nestjs/graphql';

@InputType()
export class SearchInput {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsString()
  @IsNotEmpty()
  field: string;

  @IsEnum(SearchOperatorsEnum)
  @IsNotEmpty()
  operator: SearchOperatorsEnum;
}
