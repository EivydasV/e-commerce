import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartInput } from '../inputs/create-cart.input';
import { DocId } from '../../db/types/doc-id.type';
import { UserDocument } from '../../users/schemas/user.schema';
import { ProductRepository } from '../../products/repositories/product.repository';

@Injectable()
export class CartService {
  constructor(private readonly productRepository: ProductRepository) {}
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
      throw new BadRequestException('Product is out of stock');
    }

    const findExistingProductInCart = user?.cart?.find(
      (cartItem) =>
        cartItem.productVariant.toString() === productVariant._id.toString(),
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

  async getProductById(productId: DocId) {
    return this.productRepository.findById(productId)!;
  }

  async getProductVariantById(productId: DocId, productVariantId: DocId) {
    const product = await this.productRepository.findById(productId)!;
    if (!product) throw new NotFoundException('Product not found');

    const productVariant = product.variants?.id(productVariantId);
    if (!productVariant)
      throw new NotFoundException('Product variant not found');

    return productVariant;
  }
}
