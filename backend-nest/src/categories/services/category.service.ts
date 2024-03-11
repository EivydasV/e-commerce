import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryInput } from '../inputs/create-category.input';
import { DocId } from '../../db/types/doc-id.type';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryDocument } from '../schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryInput: CreateCategoryInput, parentId?: DocId) {
    if (!parentId) {
      return this.categoryRepository.create(createCategoryInput);
    }

    const findCategory = await this.categoryRepository.findById(parentId);

    if (!findCategory) {
      throw new NotFoundException('Category not found');
    }

    return this.categoryRepository.create({
      ...createCategoryInput,
      parent: findCategory._id,
    });
  }

  async findParent(category: CategoryDocument) {
    const populateCategory = await category.populate<{
      parent: CategoryDocument;
    }>('parent');

    return populateCategory.parent;
  }

  async find() {
    return this.categoryRepository.findAll();
  }
}