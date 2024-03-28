import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { CreateCartInput } from '../inputs/create-cart.input';
import { DocId } from '../../db/types/doc-id.type';
import { UserDocument } from '../../users/schemas/user.schema';
import { ProductRepository } from '../../products/repositories/product.repository';
import { ProductVariantRepository } from '../../products/repositories/product-variant.repository';
import { Product } from '../../products/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
    private readonly productVariantRepository: ProductVariantRepository,
  ) {}
  async addToCart(
    createCartInput: CreateCartInput,
    productId: DocId,
    productVariantId: DocId,
    user: UserDocument,
  ): Promise<any> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productVariant = product?.variants?.id(productVariantId);

    if (!productVariant) {
      throw new NotFoundException('Product variant not found');
    }

    if (productVariant.quantity < createCartInput.quantity) {
      throw new NotFoundException('Product is out of stock');
    }

    const findExistingProductInCart = user?.cart?.find(
      (cartItem) =>
        cartItem.productVariant.toString() === productVariant?._id?.toString(),
    );

    if (findExistingProductInCart) {
      findExistingProductInCart.quantity += createCartInput.quantity;
      await user.save();

      return user.cart;
    }

    user.cart?.push({
      quantity: createCartInput.quantity,
      product: product._id,
      productVariant: productVariant._id,
    });

    await user.save();

    return user.cart;
  }
}
