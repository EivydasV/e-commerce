import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DocId } from '../../db/types/doc-id.type';
import { ProductRepository } from '../../products/repositories/product.repository';
import { ProductDocument } from '../../products/schemas/product.schema';
import { idsToDocumentsMapper } from 'src/graphql/helpers/ids-to-documents-mapper.helper';

@Injectable({ scope: Scope.REQUEST })
export class ProductDataLoader extends DataLoader<DocId, ProductDocument> {
  constructor(private readonly productRepository: ProductRepository) {
    super((keys) => this.batchLoadFn(keys));
  }

  private async batchLoadFn(
    productIds: readonly DocId[],
  ): Promise<ProductDocument[]> {
    const products = await this.productRepository.findAll({
      _id: { $in: productIds },
    });

    return idsToDocumentsMapper(products, productIds);
  }
}
