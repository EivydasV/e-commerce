import { Injectable } from '@nestjs/common';
import { OffsetPaginationInput } from 'src/graphql/inputs/offset-pagination.input';
import { FilterQuery, HydratedDocument, Model } from 'mongoose';
import { BaseRepository } from './base.repository';
import { OffsetPaginatedType } from '../types/offset-paginated.type';

@Injectable()
export class PageableRepository<Entity> extends BaseRepository<Entity> {
  constructor(private readonly model: Model<Entity>) {
    super(model);
  }

  async offsetPaginate(
    offsetPaginationInput: OffsetPaginationInput,
    filters?: FilterQuery<HydratedDocument<Entity>>,
  ): Promise<OffsetPaginatedType<Entity>> {
    const { perPage, skip } = offsetPaginationInput;

    const [docs, totalDocs] = await Promise.all([
      this.model
        .find(filters || {})
        .limit(perPage)
        .skip(skip),
      this.model.countDocuments(filters),
    ]);

    return this.paginate(offsetPaginationInput, docs, totalDocs);
  }
  private paginate(
    pageInfo: OffsetPaginationInput,
    docs: Entity[],
    totalDocs: number,
  ): OffsetPaginatedType<Entity> {
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
