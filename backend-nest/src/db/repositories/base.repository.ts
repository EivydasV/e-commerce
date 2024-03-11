import { BaseRepositoryType } from '../types/base-repository.type';
import {
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  Schema,
  Types,
  UpdateQuery,
} from 'mongoose';
import { OmitBaseType } from '../types/omit-base.type';
import { Injectable } from '@nestjs/common';
import { OffsetPaginationInput } from '../../graphql/inputs/offset-pagination.input';
import { PaginatedType } from '../../paginations/offset/types/paginated.type';
import { OffsetService } from '../../paginations/offset/offset.service';
import { MongooseQuery } from '../types/query.type';
import { DocId } from '../types/doc-id.type';

@Injectable()
export class BaseRepository<Doc extends Document, Entity>
  implements BaseRepositoryType<Doc, Entity>
{
  constructor(
    private readonly entity: Model<Entity>,
    private readonly offsetService: OffsetService<Entity>,
  ) {}

  async create(payload: OmitBaseType<Entity>): Promise<Entity> {
    return this.entity.create(payload);
  }

  findById(DocId: DocId): MongooseQuery<Doc> | null {
    return this.entity.findById(DocId);
  }
  findByIdAndUpdate(
    id: DocId,
    update: UpdateQuery<Entity>,
    options?: QueryOptions<Entity> | null | undefined,
  ): MongooseQuery<Doc> | null {
    return this.entity.findByIdAndUpdate(id, update, options);
  }
  findByIdAndDelete(id: DocId): MongooseQuery<Doc> | null {
    return this.entity.findByIdAndDelete(id);
  }
  findAll(filter?: FilterQuery<Doc>): MongooseQuery<Doc[]> {
    return this.entity.find(filter || {});
  }
  findOne(filter: FilterQuery<Entity> | undefined): MongooseQuery<Doc> | null {
    return this.entity.findOne(filter);
  }

  async offsetPaginate(
    offsetPaginationInput: OffsetPaginationInput,
    filters?: FilterQuery<Doc>,
  ): Promise<PaginatedType<Entity>> {
    const { perPage, skip } = offsetPaginationInput;

    const [docs, totalDocs] = await Promise.all([
      this.entity
        .find(filters || {})
        .limit(perPage)
        .skip(skip),
      this.entity.countDocuments(filters),
    ]);

    return this.offsetService.paginate(offsetPaginationInput, docs, totalDocs);
  }
}
