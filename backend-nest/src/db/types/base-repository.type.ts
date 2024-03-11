import { Document, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { OmitBaseType } from './omit-base.type';
import { OffsetPaginationInput } from '../../graphql/inputs/offset-pagination.input';
import { PaginatedType } from '../../paginations/offset/types/paginated.type';
import { MongooseQuery } from './query.type';
import { DocId } from './doc-id.type';

export interface BaseRepositoryType<Doc extends Document, Entity> {
  create(payload: OmitBaseType<Entity>): Promise<Entity>;
  findById(id: DocId): MongooseQuery<Doc> | null;
  findByIdAndUpdate(
    id: DocId,
    data: UpdateQuery<Entity>,
    options?: QueryOptions<Entity> | null | undefined,
  ): MongooseQuery<Doc> | null;
  findByIdAndDelete(id: DocId): MongooseQuery<Doc> | null;
  findAll(filter?: FilterQuery<Doc>): MongooseQuery<Doc[]>;
  findOne(filter: FilterQuery<Entity> | undefined): MongooseQuery<Doc> | null;
  offsetPaginate(
    offsetPaginationInput: OffsetPaginationInput,
    filters?: FilterQuery<Doc>,
  ): Promise<PaginatedType<Entity>>;
}
