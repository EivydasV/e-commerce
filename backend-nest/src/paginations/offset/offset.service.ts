import { Injectable } from '@nestjs/common';
import { BasePagination } from '../types/base-pagination.type';
import { OffsetPaginationInput } from 'src/graphql/inputs/offset-pagination.input';
import { Document } from 'mongoose';
import { PaginatedType } from './types/paginated.type';

@Injectable()
export class OffsetService<Doc>
  implements BasePagination<Doc, PaginatedType<Doc>>
{
  paginate(
    pageInfo: OffsetPaginationInput,
    docs: Doc[],
    totalDocs: number,
  ): PaginatedType<Doc> {
    const totalPages = Math.ceil(totalDocs / pageInfo.perPage);

    return {
      edges: docs.map((doc) => ({
        node: doc,
      })),
      totalDocs,
      totalPages,
      currentPage: pageInfo.page,
      hasNextPage: pageInfo.page < totalPages,
      hasPreviousPage: pageInfo.page > 1,
      nextPage: pageInfo.page + 1 > totalPages ? null : pageInfo.page + 1,
      previousPage: pageInfo.page - 1 < 1 ? null : pageInfo.page - 1,
    };
  }
}
