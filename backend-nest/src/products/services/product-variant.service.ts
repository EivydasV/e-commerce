import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductVariantInput } from '../inputs/create-product-variant.input';
import { ForbiddenError } from '@nestjs/apollo';
import { DocId } from '../../db/types/doc-id.type';

@Injectable()
export class ProductVariantService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(
    productVariantInput: CreateProductVariantInput[],
    productId: DocId,
    userId: DocId,
  ) {
    const findProduct = await this.productRepository.findById(productId);
    if (!findProduct) {
      throw new NotFoundException('Product not found');
    }

    if (findProduct.seller.toString() !== userId.toString()) {
      throw new ForbiddenError('You are not allowed to do this action');
    }

    if (!findProduct?.variants) {
      throw new NotFoundException('Product variants not found');
    }

    findProduct.variants.push(...productVariantInput);

    if (findProduct.variants.length > 5) {
      throw new BadRequestException(
        'You can only add 5 variants to a product.',
      );
    }

    const savedProduct = await findProduct.save();

    return savedProduct;
  }

  async remove(variantId: DocId, productId: DocId, userId: DocId) {
    const findProduct = await this.productRepository.findById(productId);
    if (!findProduct) {
      throw new NotFoundException('Product not found');
    }
    if (findProduct.seller.toString() !== userId.toString()) {
      throw new ForbiddenError('You are not allowed to do this action');
    }

    if (!findProduct?.variants) {
      throw new NotFoundException('Product variants not found');
    }

    const variantCount = findProduct.variants.length;

    findProduct.variants.pull({ _id: variantId });

    if (variantCount === findProduct.variants.length) {
      throw new NotFoundException('Variant not found');
    }

    return findProduct.save();
  }
}
