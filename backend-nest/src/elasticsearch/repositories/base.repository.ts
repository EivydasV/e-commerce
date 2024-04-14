import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  BulkResponse,
  IndicesCreateResponse,
  IndicesGetMappingResponse,
  IndicesResponseBase,
  MappingTypeMapping,
  QueryDslQueryContainer,
  SearchResponse,
  SearchSuggester,
  WriteResponseBase,
} from '@elastic/elasticsearch/lib/api/types';
import { z } from 'zod';
import { BaseRepositoryInterface } from './interfaces/base-repository.interface';

export class BaseRepository<T extends z.ZodTypeAny>
  implements BaseRepositoryInterface<T>
{
  constructor(
    private readonly elasticSearch: ElasticsearchService,
    private readonly indexName: string,
    private readonly zodSchema: T,
  ) {}

  async index(data: z.input<T>): Promise<WriteResponseBase> {
    const parsedData = this.zodSchema.parse(data);

    return this.elasticSearch.index({
      id: parsedData.id,
      index: this.indexName,
      document: parsedData,
    });
  }

  async bulkIndex(data: z.input<T>[]): Promise<BulkResponse> {
    const parsedData = this.zodSchema.array().parse(data);

    const operations = parsedData.flatMap((data) => [
      {
        index: {
          _index: this.indexName,
          _id: data.id,
        },
      },
      data,
    ]);

    return this.elasticSearch.bulk({
      operations,
    });
  }

  async search(
    query?: QueryDslQueryContainer,
    suggest?: SearchSuggester,
  ): Promise<SearchResponse<T>> {
    return this.elasticSearch.search<z.input<T>>({
      index: this.indexName,
      query: query,
      suggest,
    });
  }

  async dropIndex(): Promise<IndicesResponseBase> {
    return this.elasticSearch.indices.delete({
      index: this.indexName,
    });
  }

  async createMapping(
    mappings: MappingTypeMapping,
  ): Promise<IndicesCreateResponse> {
    return this.elasticSearch.indices.create({
      index: this.indexName,
      mappings,
    });
  }

  async geCurrentMapping(): Promise<IndicesGetMappingResponse> {
    return this.elasticSearch.indices.getMapping({
      index: this.indexName,
      ignore_unavailable: true,
    });
  }
}
