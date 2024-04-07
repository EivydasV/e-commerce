import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';
import { DocId } from '../../db/types/doc-id.type';
import { MongooseQuery } from '../../db/types/query.type';
import { PageableRepository } from '../../db/repositories/pageable.repository';

@Injectable()
export class ProductRepository extends PageableRepository<Product> {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {
    super(productModel, 'product');
  }

  findByTitle(title: string): MongooseQuery<ProductDocument> | null {
    return this.productModel.findOne({ title });
  }

  findBySlug(slug: string): MongooseQuery<ProductDocument> | null {
    return this.productModel.findOne({ slug });
  }

  findBySeller(seller: DocId): MongooseQuery<ProductDocument> | null {
    return this.productModel.findOne({ seller });
  }
}
