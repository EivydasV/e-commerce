import { Injectable } from '@nestjs/common';
import { UserDocument } from '../schemas/user.schema';
import { Cart } from '../../cart/schemas/cart.schema';

@Injectable()
export class CartService {
  constructor() {}

  async getCartByUser(currentUser: UserDocument) {
    const populatedUser = await currentUser.populate<{ cart: Cart[] }>('cart');

    return populatedUser.cart;
  }
}
