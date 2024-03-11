import { BaseRepository } from '../../db/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OffsetService } from '../../paginations/offset/offset.service';
import { Product, ProductDocument } from '../schemas/product.schema';
import { DocId } from '../../db/types/doc-id.type';
import { MongooseQuery } from '../../db/types/query.type';

@Injectable()
export class ProductRepository extends BaseRepository<
  ProductDocument,
  Product
> {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    offsetService: OffsetService<Product>,
  ) {
    super(productModel, offsetService);
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
