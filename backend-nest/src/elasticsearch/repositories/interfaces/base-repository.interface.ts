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
import { HydratedDocument } from 'mongoose';

export interface BaseRepositoryInterface<T extends z.ZodTypeAny, K> {
  index(data: z.input<T>): Promise<WriteResponseBase>;
  bulkIndex(data: z.input<T>[]): Promise<BulkResponse>;
  search(params: Omit<SearchRequest, 'index'>): Promise<SearchResponse<T>>;
  searchAndHydrate(
    params: Omit<SearchRequest, 'index'>,
  ): Promise<HydratedDocument<K>[]>;
  dropIndex(): Promise<IndicesResponseBase>;
  createMapping(mappings: MappingTypeMapping): Promise<IndicesCreateResponse>;
  geCurrentMapping(): Promise<IndicesGetMappingResponse>;
}
