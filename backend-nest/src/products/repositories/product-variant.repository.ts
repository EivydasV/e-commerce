import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageableRepository } from '../../db/repositories/pageable.repository';
import { ProductVariant } from '../schemas/product-variant.schema';

@Injectable()
export class ProductVariantRepository extends PageableRepository<ProductVariant> {
  constructor(
    @InjectModel(ProductVariant.name)
    private productVariantModel: Model<ProductVariant>,
  ) {
    super(productVariantModel);
  }
}
