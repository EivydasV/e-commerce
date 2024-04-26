import { Injectable } from '@nestjs/common';
import { ProductElasticsearchRepository } from '../repositories/product-elasticsearch.repository';
import { QueryBuilder } from '../../elasticsearch/builders/query.builder';
import { SearchProductInput } from '../inputs/search-product.input';
import { OffsetPaginationInput } from '../../graphql/inputs/offset-pagination.input';

@Injectable()
export class ProductSearchService {
  constructor(
    private readonly productElasticsearchRepository: ProductElasticsearchRepository,
    private readonly queryBuilder: QueryBuilder,
  ) {}

  async autoComplete(search: string) {
    return this.productElasticsearchRepository.search({
      size: 10,
      query: {
        multi_match: {
          query: search,
          type: 'bool_prefix',
          fields: [
            'title',
            'title._2gram',
            'title._3gram',
            'description',
            'description_2gram',
            'description_3gram',
          ],
        },
      },
      _source: {
        includes: ['title', 'description'],
      },
    });
  }

  async searchProducts(
    offsetPaginateInput: OffsetPaginationInput,
    searchProductInputs?: SearchProductInput,
  ) {
    const query = this.queryBuilder.buildQuery(searchProductInputs?.queries);

    return this.productElasticsearchRepository.offsetPaginate(
      offsetPaginateInput,
      {
        query,
      },
    );
  }
}
