import { Injectable } from '@nestjs/common';
import { SearchInput } from '../inputs/search.input';
import {
  MappingProperty,
  QueryDslQueryContainer,
} from '@elastic/elasticsearch/lib/api/types';
import { elasticsearchPropertiesConstant } from 'src/products/constants/elasticsearch-properties.constant';
import { SearchOperatorsEnum } from '../enums/search-operators.enum';
import { UnsupportedFieldError } from '../errors/unsupported-field.error';
import { UnsupportedOperatorError } from '../errors/unsupported-operator.error';
import { fieldMappings } from 'src/elasticsearch/constants/supported-operators.constant';
import { DataTypeParser } from 'src/elasticsearch/parsers/data-type.parser';

@Injectable()
export class QueryBuilder {
  constructor(private readonly dataTypeParser: DataTypeParser) {}

  buildQuery(searchInputs?: SearchInput[]): QueryDslQueryContainer | undefined {
    if (!searchInputs || !searchInputs.length) {
      return undefined;
    }

    const query: QueryDslQueryContainer = {};
    const must: QueryDslQueryContainer[] = [];
    const mustNot: QueryDslQueryContainer[] = [];
    const fieldTypes = this.getFieldTypes(elasticsearchPropertiesConstant);

    searchInputs.forEach((searchInput) => {
      const fieldDataType = this.getFieldType(searchInput.field, fieldTypes);
      this.checkDataIntegrity(searchInput, fieldDataType);

      this.checkIfOperatorIsSupportedForField(
        searchInput.operator,
        fieldDataType,
      );
      this.parseValueDataType(searchInput, fieldDataType);

      const nestedFields = searchInput.field.split('.').slice(0, -1);

      switch (searchInput?.operator) {
        case SearchOperatorsEnum.EQUAL:
          must.push(
            this.createObjectPath(nestedFields, {
              term: {
                [searchInput.field]: {
                  value: searchInput.query,
                  case_insensitive: true,
                },
              },
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

        case SearchOperatorsEnum.SEARCH:
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
        case SearchOperatorsEnum.LIKE:
          mustNot.push(
            this.createObjectPath(nestedFields, {
              multi_match: {
                query: searchInput.query,
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

  private checkDataIntegrity(
    searchInputs: SearchInput,
    fieldTypes: (keyof typeof fieldMappings)[],
  ) {
    this.checkIfOperatorIsSupportedForField(searchInputs.operator, fieldTypes);
  }

  private parseValueDataType(
    searchInputs: SearchInput,
    fieldTypes: (keyof typeof fieldMappings)[],
  ) {
    return fieldTypes.map((type) => {
      return this.dataTypeParser.parse(searchInputs, type);
    })[0];
  }

  private getFieldType(
    searchField: string,
    fieldTypes: Record<string, (keyof typeof fieldMappings)[]>,
  ) {
    const fieldDataType = fieldTypes[searchField];
    if (!fieldDataType) {
      throw new UnsupportedFieldError(searchField);
    }

    return fieldDataType;
  }

  private checkIfOperatorIsSupportedForField(
    operator: SearchOperatorsEnum,
    types: (keyof typeof fieldMappings)[],
  ) {
    const isSupported = types.some((type) =>
      fieldMappings[type].includes(operator),
    );

    if (!isSupported) {
      throw new UnsupportedOperatorError(operator);
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

  private getFieldTypes(
    properties: Record<string, MappingProperty>,
    prefix = '',
  ): Record<string, (keyof typeof fieldMappings)[]> {
    return Object.entries(properties).reduce((acc, [fieldName, fieldType]) => {
      const fullFieldName = prefix ? `${prefix}.${fieldName}` : fieldName;

      if (fieldType.type === 'nested' && 'properties' in fieldType) {
        if (!fieldType?.properties) {
          throw new Error('Properties are missing');
        }

        return Object.assign(
          acc,
          this.getFieldTypes(fieldType.properties, fullFieldName),
        );
      } else {
        const types = [fieldType.type];
        if ('properties' in fieldType) {
          if (fieldType.properties) {
            Object.values(fieldType.properties).forEach((property) => {
              if (property.type) {
                types.push(property.type);
              }
            });
          }
        }

        return { ...acc, [fullFieldName]: types };
      }
    }, {});
  }
}
