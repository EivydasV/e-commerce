import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { productEventsConstant } from '../constants/product-events.constant';
import { ProductElasticsearchRepository } from '../repositories/product-elasticsearch.repository';
import { ProductDocument, ProductEntityName } from '../schemas/product.schema';
import { entityTypeCheck } from '../../utils/entity/entity-type-check';
import { Category } from '../../categories/schemas/category.schema';

@Injectable()
export class PostSaveProductListener {
  constructor(
    private readonly productElasticsearchRepository: ProductElasticsearchRepository,
  ) {}

  @OnEvent(productEventsConstant.postCreated)
  @OnEvent(productEventsConstant.postUpdated)
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
