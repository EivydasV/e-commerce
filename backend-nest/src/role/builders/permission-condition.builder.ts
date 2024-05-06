import { Injectable } from '@nestjs/common';
import { QueryFilterInput } from 'src/role/inputs/query-filter.input';
import { FilterInput } from 'src/role/inputs/filter-input';

@Injectable()
export class PermissionConditionBuilder {
  build(queryFilterInputs?: QueryFilterInput[]) {
    if (!queryFilterInputs || !queryFilterInputs.length) {
      return;
    }

    return queryFilterInputs.reduce(
      (acc: Record<string, FilterInput>, { filter, field }) => {
        if (!field || !filter || !filter.operator || !filter.compareTo) {
          return acc;
        }

        return {
          ...acc,
          [field]: { [filter.operator?.toString()]: filter.compareTo },
        };
      },
      {},
    );
  }
}
