import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { DocId } from '../../db/types/doc-id.type';
import { MongooseQuery } from '../../db/types/query.type';
import { PageableRepository } from '../../db/repositories/pageable.repository';

@Injectable()
export class CategoryRepository extends PageableRepository<Category> {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {
    super(categoryModel, 'category');
  }

  findByParent(parentId: DocId): MongooseQuery<CategoryDocument> | null {
    return this.categoryModel.findOne({ parent: parentId });
  }
}
