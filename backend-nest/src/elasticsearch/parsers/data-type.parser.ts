import { Injectable } from '@nestjs/common';
import { SearchInput } from 'src/elasticsearch/inputs/search.input';
import { fieldMappings } from 'src/elasticsearch/constants/supported-operators.constant';
import { InvalidValueForTypeError } from 'src/elasticsearch/errors/invalid-value-for-type.error';
import { UnsupportedFieldError } from 'src/elasticsearch/errors/unsupported-field.error';

@Injectable()
export class DataTypeParser {
  parse(searchInputs: SearchInput, type: keyof typeof fieldMappings) {
    if (type === 'integer' || type === 'float') {
      const parsedValue = parseFloat(searchInputs.query);
      if (isNaN(parsedValue)) {
        throw new InvalidValueForTypeError(
          type,
          searchInputs.query,
          searchInputs.field,
        );
      }

      return parsedValue;
    } else if (type === 'date') {
      const parsedValue = new Date(searchInputs.query);
      if (parsedValue.toString() === 'Invalid Date') {
        throw new InvalidValueForTypeError(
          type,
          searchInputs.query,
          searchInputs.field,
        );
      }

      return parsedValue;
    } else if (type === 'boolean') {
      const value = searchInputs.query.toLowerCase();
      if (value !== 'true' && value !== 'false') {
        throw new InvalidValueForTypeError(
          type,
          searchInputs.query,
          searchInputs.field,
        );
      }

      return value;
    } else if (
      type === 'search_as_you_type' ||
      type === 'text' ||
      type === 'keyword'
    ) {
      return searchInputs.query;
    } else {
      throw new UnsupportedFieldError(searchInputs.field);
    }
  }
}
