import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductVariantInput } from '../inputs/create-product-variant.input';
import { DocId } from 'src/db/types/doc-id.type';
import { AppAbility } from 'src/casl/types/app-ability.type';
import { ActionEnum } from 'src/casl/enums/action.enum';
import { ForbiddenError, subject } from '@casl/ability';
import { SubjectEnum } from 'src/casl/enums/subject.enum';

@Injectable()
export class ProductVariantService {
  constructor(private readonly productRepository: ProductRepository) {}

  async create(
    productVariantInput: CreateProductVariantInput[],
    productId: DocId,
    abilities: AppAbility,
  ) {
    const findProduct = await this.productRepository.findById(productId);
    if (!findProduct) {
      throw new NotFoundException('Product not found');
    }

    ForbiddenError.from(abilities).throwUnlessCan(
      ActionEnum.Create,
      subject(SubjectEnum.Product, findProduct),
    );

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

  async remove(variantId: DocId, productId: DocId, abilities: AppAbility) {
    const findProduct = await this.productRepository.findById(productId);
    if (!findProduct) {
      throw new NotFoundException('Product not found');
    }

    ForbiddenError.from(abilities).throwUnlessCan(
      ActionEnum.Delete,
      subject(SubjectEnum.Product, findProduct),
    );

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
