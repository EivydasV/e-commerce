import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { DocId } from '../../db/types/doc-id.type';
import { CategoryRepository } from '../../categories/repositories/category.repository';
import { CategoryDocument } from '../../categories/schemas/category.schema';

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

    return categoryIds.map(
      (categoryId) =>
        categories.find((doc) => doc._id.toString() === categoryId.toString())!,
    );
  }
}
