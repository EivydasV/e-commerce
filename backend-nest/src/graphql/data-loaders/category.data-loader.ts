import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DocId } from 'src/db/types/doc-id.type';
import { CategoryRepository } from 'src/categories/repositories/category.repository';
import { CategoryDocument } from 'src/categories/schemas/category.schema';
import { idsToDocumentsMapper } from 'src/graphql/helpers/ids-to-documents-mapper.helper';

@Injectable({ scope: Scope.REQUEST })
export class CategoryDataLoader extends DataLoader<DocId, CategoryDocument> {
  constructor(private readonly categoryRepository: CategoryRepository) {
    super((keys) => this.batchLoadFn(keys));
  }

  private async batchLoadFn(
    categoryIds: readonly DocId[],
  ): Promise<CategoryDocument[]> {
    const categories = await this.categoryRepository.findAll({
      _id: { $in: categoryIds },
    });

    return idsToDocumentsMapper(categories, categoryIds);
  }
}
