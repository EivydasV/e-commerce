import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductInput } from '../inputs/create-product.input';
import urlSlug from 'url-slug';
import { ProductDocument } from '../schemas/product.schema';
import { UserDocument } from '../../users/schemas/user.schema';
import { DocId } from '../../db/types/doc-id.type';
import { OffsetPaginationInput } from '../../graphql/inputs/offset-pagination.input';
import { UpdateProductInput } from '../inputs/update-product.input';
import { CategoryRepository } from '../../categories/repositories/category.repository';
import { Category } from '../../categories/schemas/category.schema';
import { ProductElasticsearch } from '../elasticsearch/product.elasticsearch';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    // private readonly productSearch: ProductElasticsearch,
  ) {}

  async create(
    createProductInput: CreateProductInput,
    categoryIds: DocId[],
    userId: DocId,
  ) {
    const findProductByTitle = await this.productRepository.findByTitle(
      createProductInput.title,
    );

    if (findProductByTitle) {
      throw new BadRequestException('Product with this title already exists.');
    }
    const findCategories = await this.categoryRepository.findAll({
      _id: { $in: categoryIds },
    });

    if (findCategories.length !== categoryIds.length) {
      throw new BadRequestException('Some specified categories does not exist');
    }

    const slug = urlSlug(createProductInput.title);
    return this.productRepository.create({
      ...createProductInput,
      slug,
      seller: userId,
      categories: categoryIds,
    });
  }

  async findSeller(product: ProductDocument) {
    const populatedProduct = await product.populate<{ seller: UserDocument }>(
      'seller',
    );

    return populatedProduct.seller;
  }

  async findBySlug(slug: string) {
    return this.productRepository.findBySlug(slug);
  }

  paginate(offsetPaginationInput: OffsetPaginationInput, id: DocId) {
    return this.productRepository.offsetPaginate(offsetPaginationInput, {
      seller: id,
    });
  }

  async delete(productId: DocId, userId: DocId) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new BadRequestException('Product not found.');
    }

    if (product.seller.toString() !== userId.toString()) {
      throw new BadRequestException(
        'You are not authorized to delete this product.',
      );
    }

    return product.deleteOne();
  }

  async update(
    productId: DocId,
    userId: DocId,
    updateProductInput: UpdateProductInput,
  ) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new BadRequestException('Product not found.');
    }

    if (product.seller.toString() !== userId.toString()) {
      throw new BadRequestException(
        'You are not authorized to update this product.',
      );
    }

    if (updateProductInput.isPublished === true && !product?.variants?.length) {
      throw new BadRequestException(
        'You cannot publish a product without variants',
      );
    }

    return this.productRepository.findByIdAndUpdate(
      productId,
      updateProductInput,
      { new: true },
    );
  }

  async findCategories(product: ProductDocument) {
    const populatedProduct = await product.populate<{ categories: Category[] }>(
      {
        path: 'categories',
        model: Category.name,
      },
    );

    return populatedProduct.categories;
  }
}
