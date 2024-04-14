import { Injectable } from '@nestjs/common';
import { ProductElasticsearchRepository } from '../repositories/product-elasticsearch.repository';

@Injectable()
export class ProductSearchService {
  constructor(
    private readonly productElasticsearchRepository: ProductElasticsearchRepository,
  ) {}

  async autoComplete(search: string) {
    return this.productElasticsearchRepository.search(
      {
        match: { title: search },
      },
      {
        productSuggest: {
          text: search,
          term: {
            field: 'title',
          },
        },
      },
    );
  }
}
