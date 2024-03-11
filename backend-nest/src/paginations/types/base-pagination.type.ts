import { OffsetPaginationInput } from '../../graphql/inputs/offset-pagination.input';
import { Document } from 'mongoose';

export interface BasePagination<Doc, Return> {
  paginate(
    pageInfo: OffsetPaginationInput,
    docs: Doc[],
    totalDocs: number,
  ): Return;
}
