import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { ProductIndexType } from '../types/product-index.type';

@Injectable()
export class ProductSearch implements OnModuleInit {
  private static index = 'products';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    const getMapping = await this.elasticsearchService.indices.getMapping();
    if (!(ProductSearch.index in getMapping)) {
      await this.createMapping();
    }
  }

  async index(product: ProductIndexType) {
    return this.elasticsearchService.index({
      index: ProductSearch.index,
      document: product,
      refresh: true,
    });
  }

  private async createMapping() {
    return this.elasticsearchService.indices.create({
      index: ProductSearch.index,
      mappings: {
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
      },
    });
  }
}
