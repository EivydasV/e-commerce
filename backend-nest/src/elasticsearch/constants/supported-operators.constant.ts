import { SearchOperatorsEnum } from '../enums/search-operators.enum';

export const supportedOperatorsConstant = {
  date: {
    [SearchOperatorsEnum.EQUAL]: SearchOperatorsEnum.EQUAL,
    [SearchOperatorsEnum.NOT_EQUAL]: SearchOperatorsEnum.NOT_EQUAL,
    [SearchOperatorsEnum.GREATER_THAN]: SearchOperatorsEnum.GREATER_THAN,
    [SearchOperatorsEnum.GREATER_THAN_OR_EQUAL]:
      SearchOperatorsEnum.GREATER_THAN_OR_EQUAL,
    [SearchOperatorsEnum.LESS_THAN]: SearchOperatorsEnum.LESS_THAN,
    [SearchOperatorsEnum.LESS_THAN_OR_EQUAL]:
      SearchOperatorsEnum.LESS_THAN_OR_EQUAL,
  },
  number: {
    [SearchOperatorsEnum.EQUAL]: SearchOperatorsEnum.EQUAL,
    [SearchOperatorsEnum.NOT_EQUAL]: SearchOperatorsEnum.NOT_EQUAL,
    [SearchOperatorsEnum.GREATER_THAN]: SearchOperatorsEnum.GREATER_THAN,
    [SearchOperatorsEnum.GREATER_THAN_OR_EQUAL]:
      SearchOperatorsEnum.GREATER_THAN_OR_EQUAL,
    [SearchOperatorsEnum.LESS_THAN]: SearchOperatorsEnum.LESS_THAN,
    [SearchOperatorsEnum.LESS_THAN_OR_EQUAL]:
      SearchOperatorsEnum.LESS_THAN_OR_EQUAL,
  },
  boolean: {
    [SearchOperatorsEnum.EQUAL]: SearchOperatorsEnum.EQUAL,
    [SearchOperatorsEnum.NOT_EQUAL]: SearchOperatorsEnum.NOT_EQUAL,
  },
  string: {
    [SearchOperatorsEnum.EQUAL]: SearchOperatorsEnum.EQUAL,
    [SearchOperatorsEnum.NOT_EQUAL]: SearchOperatorsEnum.NOT_EQUAL,
  },

  search_as_you_type: {
    [SearchOperatorsEnum.LIKE]: SearchOperatorsEnum.LIKE,
    [SearchOperatorsEnum.NOT_LIKE]: SearchOperatorsEnum.NOT_LIKE,
  },
} as const;
