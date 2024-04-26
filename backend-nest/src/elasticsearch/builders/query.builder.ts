import { Injectable } from '@nestjs/common';
import { SearchInput } from '../inputs/search.input';
import {
  MappingProperty,
  QueryDslQueryContainer,
} from '@elastic/elasticsearch/lib/api/types';
import { elasticsearchPropertiesConstant } from '../../products/constants/elasticsearch-properties.constant';
import { supportedOperatorsConstant } from '../constants/supported-operators.constant';
import { SearchOperatorsEnum } from '../enums/search-operators.enum';
import { UnsupportedFieldError } from '../errors/unsupported-field.error';
import { UnsupportedOperatorError } from '../errors/unsupported-operator.error';
import { InvalidValueForTypeError } from '../errors/invalid-value-for-type.error';

@Injectable()
export class QueryBuilder {
  buildQuery(searchInputs?: SearchInput[]): QueryDslQueryContainer | undefined {
    if (!searchInputs || !searchInputs.length) {
      return undefined;
    }

    const query: QueryDslQueryContainer = {};
    const must: QueryDslQueryContainer[] = [];
    const mustNot: QueryDslQueryContainer[] = [];
    const fieldTypes = this.getFieldTypes(elasticsearchPropertiesConstant);

    searchInputs.forEach((searchInput) => {
      const fieldDataType = fieldTypes[searchInput.field];
      if (!fieldDataType) {
        throw new UnsupportedFieldError(searchInput.field);
      }

      this.checkIfOperatorIsSupportedForField(
        searchInput.operator,
        fieldDataType,
      );

      this.checkValueDataType(
        searchInput.query,
        fieldDataType,
        searchInput.field,
      );

      const nestedFields = searchInput.field.split('.').slice(0, -1);

      switch (searchInput?.operator) {
        case SearchOperatorsEnum.EQUAL:
          must.push(
            this.createObjectPath(nestedFields, {
              match: { [searchInput.field]: searchInput.query },
            }),
          );

          break;
        case SearchOperatorsEnum.NOT_EQUAL:
          mustNot.push(
            this.createObjectPath(nestedFields, {
              match: { [searchInput.field]: searchInput.query },
            }),
          );

          break;
        case SearchOperatorsEnum.GREATER_THAN:
          must.push(
            this.createObjectPath(nestedFields, {
              range: { [searchInput.field]: { gt: searchInput.query } },
            }),
          );

          break;
        case SearchOperatorsEnum.GREATER_THAN_OR_EQUAL:
          must.push(
            this.createObjectPath(nestedFields, {
              range: { [searchInput.field]: { gte: searchInput.query } },
            }),
          );

          break;
        case SearchOperatorsEnum.LESS_THAN:
          must.push(
            this.createObjectPath(nestedFields, {
              range: { [searchInput.field]: { lt: searchInput.query } },
            }),
          );

          break;
        case SearchOperatorsEnum.LESS_THAN_OR_EQUAL:
          must.push(
            this.createObjectPath(nestedFields, {
              range: { [searchInput.field]: { lte: searchInput.query } },
            }),
          );

          break;
        case SearchOperatorsEnum.IN:
          must.push(
            this.createObjectPath(nestedFields, {
              terms: { [searchInput.field]: searchInput.query },
            }),
          );

          break;

        case SearchOperatorsEnum.NOT_IN:
          mustNot.push(
            this.createObjectPath(nestedFields, {
              terms: { [searchInput.field]: searchInput.query },
            }),
          );

          break;

        case SearchOperatorsEnum.LIKE:
          must.push(
            this.createObjectPath(nestedFields, {
              multi_match: {
                query: searchInput.query,
                type: 'bool_prefix',
                fields: [
                  searchInput.field,
                  `${searchInput.field}._2gram`,
                  `${searchInput.field}._3gram`,
                ],
              },
            }),
          );

          break;

        case SearchOperatorsEnum.NOT_LIKE:
          mustNot.push(
            this.createObjectPath(nestedFields, {
              multi_match: {
                query: searchInput.query,
                type: 'bool_prefix',
                fields: [
                  searchInput.field,
                  `${searchInput.field}._2gram`,
                  `${searchInput.field}._3gram`,
                ],
              },
            }),
          );

          break;
        default:
          throw new UnsupportedOperatorError(searchInput.operator);
      }
    });

    query.bool = {
      must,
      must_not: mustNot,
    };

    return query;
  }

  private checkIfOperatorIsSupportedForField(
    operator: SearchOperatorsEnum,
    type: keyof typeof supportedOperatorsConstant,
  ) {
    const supportedOperators = supportedOperatorsConstant[type];
    if (!(operator in supportedOperators)) {
      throw new UnsupportedOperatorError(operator);
    }
  }

  private checkValueDataType(
    value: string,
    type: keyof typeof supportedOperatorsConstant,
    field: string,
  ) {
    if (type === 'boolean') {
      if (value !== 'true' && value !== 'false') {
        throw new InvalidValueForTypeError(type, value, field);
      }
    } else if (type === 'number') {
      if (isNaN(Number(value))) {
        throw new InvalidValueForTypeError(type, value, field);
      }
    } else if (type === 'date') {
      if (isNaN(Date.parse(value))) {
        throw new InvalidValueForTypeError(type, value, field);
      }
    } else if (type === 'string' || type === 'search_as_you_type') {
    } else {
      throw new InvalidValueForTypeError(type, value, field);
    }
  }

  private createObjectPath(
    nestedFields: string[],
    query: QueryDslQueryContainer,
    prevPath = '',
  ): QueryDslQueryContainer {
    if (!nestedFields.length) {
      return query;
    }

    const [head, ...tail] = nestedFields;

    return {
      nested: {
        path: prevPath + (prevPath ? '.' : '') + head,
        query: this.createObjectPath(
          tail,
          query,
          prevPath + (prevPath ? '.' : '') + head,
        ),
      },
    };
  }

  private getPropertyType(
    property: MappingProperty,
  ): keyof typeof supportedOperatorsConstant {
    if (property.type === 'date') {
      return 'date';
    } else if (property.type === 'boolean') {
      return 'boolean';
    } else if (property.type === 'float' || property.type === 'integer') {
      return 'number';
    } else if (property.type === 'search_as_you_type') {
      return 'search_as_you_type';
    } else {
      return 'string';
    }
  }

  private getFieldTypes(
    properties: Record<string, MappingProperty>,
    prefix = '',
  ): Record<string, keyof typeof supportedOperatorsConstant> {
    return Object.entries(properties).reduce((acc, [fieldName, fieldType]) => {
      const fullFieldName = prefix ? `${prefix}.${fieldName}` : fieldName;

      const type = this.getPropertyType(fieldType);

      if (fieldType.type === 'nested' && 'properties' in fieldType) {
        if (!fieldType?.properties) {
          throw new Error('Properties are missing');
        }

        return Object.assign(
          acc,
          this.getFieldTypes(fieldType.properties, fullFieldName),
        );
      } else {
        return { ...acc, [fullFieldName]: type };
      }
    }, {});
  }
}
