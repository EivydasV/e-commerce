import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { productEventType } from '../types/product-event.type';
import { ProductElasticsearchRepository } from '../repositories/product-elasticsearch.repository';
import {
  Product,
  ProductDocument,
  ProductEntityName,
} from '../schemas/product.schema';
import { entityTypeCheck } from '../../utils/entity/entity-type-check';
import { Category } from '../../categories/schemas/category.schema';
import { productIndexValidation } from '../validations/product-elasticsearch.validation';

@Injectable()
export class PostProductListener {
  constructor(
    private readonly productElasticsearchRepository: ProductElasticsearchRepository,
  ) {}

  @OnEvent(productEventType.postCreated)
  async handlePostProductEvent(payload: unknown) {
    if (entityTypeCheck(payload, ProductEntityName)) {
      const product = payload as ProductDocument;
      const populatedProduct = await product.populate<{
        categories: Category[];
      }>({
        path: 'categories',
        model: Category.name,
      });

      await this.productElasticsearchRepository.index(populatedProduct);
    }
  }
}
