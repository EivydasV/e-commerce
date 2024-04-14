import {
  BulkResponse,
  IndicesCreateResponse,
  IndicesGetMappingResponse,
  IndicesResponseBase,
  MappingTypeMapping,
  QueryDslQueryContainer,
  SearchResponse,
  WriteResponseBase,
} from '@elastic/elasticsearch/lib/api/types';
import { z } from 'zod';

export interface BaseRepositoryInterface<T extends z.ZodTypeAny> {
  index(data: z.input<T>): Promise<WriteResponseBase>;
  bulkIndex(data: z.input<T>[]): Promise<BulkResponse>;
  search(query?: QueryDslQueryContainer): Promise<SearchResponse<T>>;
  dropIndex(): Promise<IndicesResponseBase>;
  createMapping(mappings: MappingTypeMapping): Promise<IndicesCreateResponse>;
  geCurrentMapping(): Promise<IndicesGetMappingResponse>;
}
