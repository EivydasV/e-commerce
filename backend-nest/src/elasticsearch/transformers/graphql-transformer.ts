import { Injectable } from '@nestjs/common';
import { ElasticsearchToGraphqlTransformerInterface } from '../interfaces/elasticsearch-to-graphql-transformer.interface';
import { ElasticsearchModelInterface } from '../interfaces/elasticsearch-model.interface';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

@Injectable()
export class ElasticSearchToGraphqlTransformer
  implements ElasticsearchToGraphqlTransformerInterface
{
  transform<T>(data: SearchResponse<T>): ElasticsearchModelInterface<T> {
    const total = data.hits.total;
    let count = 0;
    if (total !== undefined) {
      if (typeof total === 'number') {
        count = total;
      } else {
        count = total.value;
      }
    }

    const hits = data.hits.hits.map((hit) => ({
      _index: hit._index,
      _id: hit._id,
      _score: hit._score,
      _source: hit._source,
    }));

    return {
      maxScore: data.hits.max_score,
      count,
      hits,
    };
  }
}
