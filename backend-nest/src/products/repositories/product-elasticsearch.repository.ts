import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { productIndexSchema } from '../validations/product-elasticsearch.validation';
import { ElasticsearchToProductMapper } from '../mappers/elasticsearch-to-product.mapper';
import { Product } from '../schemas/product.schema';
import { elasticsearchPropertiesConstant } from '../constants/elasticsearch-properties.constant';
import { PageableRepository } from '../../elasticsearch/repositories/pageable.repository';

@Injectable()
export class ProductElasticsearchRepository
  extends PageableRepository<typeof productIndexSchema, Product>
  implements OnModuleInit
{
  static readonly INDEX = 'products';

  constructor(
    readonly elasticSearchService: ElasticsearchService,
    readonly elasticsearchToProductMapper: ElasticsearchToProductMapper,
  ) {
    super(
      elasticSearchService,
      elasticsearchToProductMapper,
      ProductElasticsearchRepository.INDEX,
      productIndexSchema,
    );
  }

  async onModuleInit() {
    const currentMapping = await this.geCurrentMapping();

    if (!currentMapping[ProductElasticsearchRepository.INDEX]) {
      await this.createMapping({
        properties: elasticsearchPropertiesConstant,
      });
    }
  }
}
