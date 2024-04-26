import { BaseRepository } from './base.repository';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { MapperInterface } from '../../core/interfaces/mapper.interface';
import {
  SearchRequest,
  SearchResponse,
  SearchTotalHits,
} from '@elastic/elasticsearch/lib/api/types';
import { z } from 'zod';
import { HydratedDocument } from 'mongoose';
import { OffsetPaginationInput } from '../../graphql/inputs/offset-pagination.input';
import { OffsetPaginatedType } from '../../db/types/offset-paginated.type';
import { PageLimitReachedError } from '../../core/errors/page-limit-reached.error';

export class PageableRepository<
  T extends z.ZodTypeAny,
  K,
> extends BaseRepository<T, K> {
  constructor(
    readonly pElasticSearch: ElasticsearchService,
    private readonly pEntityMapper: MapperInterface<
      SearchResponse<z.output<T>>,
      HydratedDocument<K>[]
    >,
    readonly pIndexName: string,
    readonly pZodSchema: T,
  ) {
    super(pElasticSearch, pEntityMapper, pIndexName, pZodSchema);
  }

  async offsetPaginate(
    offsetPaginationInput: OffsetPaginationInput,
    params: Omit<SearchRequest, 'index' | 'from' | 'size'>,
  ): Promise<OffsetPaginatedType<K>> {
    const { perPage, skip, isLimitReached } = offsetPaginationInput;

    if (isLimitReached) {
      throw new PageLimitReachedError();
    }

    const search = await this.search({ ...params, from: skip, size: perPage });

    const docs = await this.pEntityMapper.transform(search);

    return this.paginate(offsetPaginationInput, docs, search.hits.total);
  }

  private paginate(
    pageInfo: OffsetPaginationInput,
    docs: K[],
    totalDocs: number | SearchTotalHits | undefined,
  ): OffsetPaginatedType<K> {
    let count = 0;
    if (totalDocs) {
      if (typeof totalDocs === 'number') {
        count = totalDocs;
      } else {
        count = totalDocs.value;
      }
    }

    const totalPages = Math.ceil(count / pageInfo.perPage);

    return {
      edges: docs.map((doc) => ({
        node: doc,
      })),
      totalDocs: count,
      totalPages,
      currentPage: pageInfo.page,
      hasNextPage: pageInfo.page < totalPages,
      hasPreviousPage: pageInfo.page > 1,
      nextPage: pageInfo.page + 1 > totalPages ? null : pageInfo.page + 1,
      previousPage: pageInfo.page - 1 < 1 ? null : pageInfo.page - 1,
    };
  }
}
