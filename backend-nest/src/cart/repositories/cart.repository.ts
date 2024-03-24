import { BaseRepository } from '../../db/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocId } from '../../db/types/doc-id.type';
import { MongooseQuery } from '../../db/types/query.type';
import { Cart, CartDocument } from '../schemas/cart.schema';

@Injectable()
export class CartRepository extends BaseRepository<Cart> {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {
    super(cartModel);
  }

  findByProduct(productId: DocId): MongooseQuery<CartDocument> | null {
    return this.cartModel.findOne({ product: productId });
  }
}
