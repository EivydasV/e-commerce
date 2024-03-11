import { BaseRepository } from '../../db/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OffsetService } from '../../paginations/offset/offset.service';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { DocId } from '../../db/types/doc-id.type';
import { MongooseQuery } from '../../db/types/query.type';

@Injectable()
export class CategoryRepository extends BaseRepository<
  CategoryDocument,
  Category
> {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    offsetService: OffsetService<Category>,
  ) {
    super(categoryModel, offsetService);
  }

  findByParent(parentId: DocId): MongooseQuery<CategoryDocument> | null {
    return this.categoryModel.findOne({ parent: parentId });
  }
}
