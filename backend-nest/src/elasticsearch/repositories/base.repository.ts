import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  BulkResponse,
  IndicesCreateResponse,
  IndicesGetMappingResponse,
  IndicesResponseBase,
  MappingTypeMapping,
  SearchRequest,
  SearchResponse,
  WriteResponseBase,
} from '@elastic/elasticsearch/lib/api/types';
import { z } from 'zod';
import { BaseRepositoryInterface } from './interfaces/base-repository.interface';
import { MapperInterface } from '../../core/interfaces/mapper.interface';
import { HydratedDocument } from 'mongoose';

export class BaseRepository<T extends z.ZodTypeAny, K>
  implements BaseRepositoryInterface<T, K>
{
  constructor(
    private readonly elasticSearch: ElasticsearchService,
    private readonly entityMapper: MapperInterface<
      SearchResponse<z.output<T>>,
      HydratedDocument<K>[]
    >,
    private readonly indexName: string,
    private readonly zodSchema: T,
  ) {}

  async index(data: z.input<T>): Promise<WriteResponseBase> {
    const parsedData = this.zodSchema.parse(data);

    return this.elasticSearch.index<z.input<T>>({
      id: parsedData.id,
      index: this.indexName,
      document: parsedData,
    });
  }

  async updateIndex(data: z.input<T>): Promise<WriteResponseBase> {
    const parsedData = this.zodSchema.parse(data);

    return this.elasticSearch.update<z.input<T>>({
      id: parsedData.id,
      index: this.indexName,
      doc: {},
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
    params: Omit<SearchRequest, 'index'>,
  ): Promise<SearchResponse<z.output<T>>> {
    return this.elasticSearch.search<z.input<T>>({
      ...params,
      index: this.indexName,
    });
  }

  async searchAndHydrate(
    params: Omit<SearchRequest, 'index'>,
  ): Promise<HydratedDocument<K>[]> {
    const search = await this.search(params);

    return this.entityMapper.transform(search);
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
      settings: {
        mapping: {
          coerce: false,
        },
      },
    });
  }

  async geCurrentMapping(): Promise<IndicesGetMappingResponse> {
    return this.elasticSearch.indices.getMapping({
      index: this.indexName,
      ignore_unavailable: true,
    });
  }
}
