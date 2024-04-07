import { Injectable, OnModuleInit } from '@nestjs/common';
import { BaseRepository } from '../../elasticsearch/repositories/base.repository';
import { Product } from '../schemas/product.schema';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ProductElasticsearchRepository
  extends BaseRepository<Product>
  implements OnModuleInit
{
  static readonly INDEX = 'products';

  constructor(private readonly elasticSearchService: ElasticsearchService) {
    super(elasticSearchService, ProductElasticsearchRepository.INDEX);
  }

  async onModuleInit() {
    const currentMapping = await this.geCurrentMapping();
    if (!currentMapping[ProductElasticsearchRepository.INDEX]) {
      await this.createMapping({
        properties: {
          title: { type: 'search_as_you_type' },
          description: { type: 'text' },
          categories: {
            type: 'nested',
            properties: {
              name: { type: 'text' },
            },
          },
          manufacturer: { type: 'text' },
          isPublished: { type: 'boolean' },
          variants: {
            type: 'nested',
            properties: {
              pricing: {
                type: 'nested',
                properties: {
                  cost: { type: 'float' },
                  currency: { type: 'text' },
                  salePrice: { type: 'float' },
                },
              },
              quantity: { type: 'integer' },
              color: { type: 'text' },
            },
          },
          createdAt: { type: 'date' },
          updatedAt: { type: 'date' },
        },
      });
    }
  }
}
