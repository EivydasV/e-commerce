import { ElasticsearchModelInterface } from './elasticsearch-model.interface';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

export interface ElasticsearchToGraphqlTransformerInterface {
  transform<T>(data: SearchResponse<T>): ElasticsearchModelInterface<T>;
}
