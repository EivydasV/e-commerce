import { SearchOperatorsEnum } from 'src/elasticsearch/enums/search-operators.enum';

export const fieldMappings = {
  keyword: [SearchOperatorsEnum.EQUAL],
  text: [SearchOperatorsEnum.LIKE],
  boolean: [SearchOperatorsEnum.EQUAL],
  float: [
    SearchOperatorsEnum.EQUAL,
    SearchOperatorsEnum.GREATER_THAN,
    SearchOperatorsEnum.GREATER_THAN_OR_EQUAL,
    SearchOperatorsEnum.LESS_THAN,
    SearchOperatorsEnum.LESS_THAN_OR_EQUAL,
  ],
  integer: [
    SearchOperatorsEnum.EQUAL,
    SearchOperatorsEnum.GREATER_THAN,
    SearchOperatorsEnum.GREATER_THAN_OR_EQUAL,
    SearchOperatorsEnum.LESS_THAN,
    SearchOperatorsEnum.LESS_THAN_OR_EQUAL,
  ],
  date: [
    SearchOperatorsEnum.EQUAL,
    SearchOperatorsEnum.GREATER_THAN,
    SearchOperatorsEnum.GREATER_THAN_OR_EQUAL,
    SearchOperatorsEnum.LESS_THAN,
    SearchOperatorsEnum.LESS_THAN_OR_EQUAL,
  ],
  search_as_you_type: [SearchOperatorsEnum.SEARCH],
};
