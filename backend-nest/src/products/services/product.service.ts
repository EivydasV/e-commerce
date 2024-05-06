import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CreateProductInput } from '../inputs/create-product.input';
import urlSlug from 'url-slug';
import { DocId } from 'src/db/types/doc-id.type';
import { OffsetPaginationInput } from 'src/graphql/inputs/offset-pagination.input';
import { UpdateProductInput } from '../inputs/update-product.input';
import { CategoryRepository } from 'src/categories/repositories/category.repository';
import { UserDataLoader } from 'src/graphql/data-loaders/user.data-loader';
import { CategoryDataLoader } from 'src/graphql/data-loaders/category.data-loader';
import { AppAbility } from 'src/casl/types/app-ability.type';
import { ActionEnum } from 'src/casl/enums/action.enum';
import { ForbiddenError, subject } from '@casl/ability';
import { SubjectEnum } from 'src/casl/enums/subject.enum';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly userDataLoader: UserDataLoader,
    private readonly categoryDataLoader: CategoryDataLoader,
  ) {}

  async create(
    createProductInput: CreateProductInput,
    categoryIds: DocId[],
    userId: DocId,
    abilities: AppAbility,
  ) {
    ForbiddenError.from(abilities).throwUnlessCan(
      ActionEnum.Create,
      SubjectEnum.Product,
    );

    const findProductByTitle = await this.productRepository.findByTitle(
      createProductInput.title,
    );

    if (findProductByTitle) {
      throw new BadRequestException('Product with this title already exists.');
    }

    if (categoryIds.length > 10) {
      throw new BadRequestException(
        'You can only assign a product to a maximum of 10 categories',
      );
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

  async findBySlug(slug: string) {
    return this.productRepository.findBySlug(slug);
  }

  paginate(offsetPaginationInput: OffsetPaginationInput, id: DocId) {
    return this.productRepository.offsetPaginate(offsetPaginationInput, {
      seller: id,
    });
  }

  async delete(productId: DocId, userId: DocId, abilities: AppAbility) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new BadRequestException('Product not found.');
    }

    ForbiddenError.from(abilities).throwUnlessCan(
      ActionEnum.Delete,
      subject(SubjectEnum.Product, product),
    );

    return product.deleteOne();
  }

  async update(
    productId: DocId,
    updateProductInput: UpdateProductInput,
    abilities: AppAbility,
  ) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new BadRequestException('Product not found.');
    }

    ForbiddenError.from(abilities).throwUnlessCan(
      ActionEnum.Update,
      subject(SubjectEnum.Product, product),
    );

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

  async loadByIds(ids: DocId[]) {
    return this.categoryDataLoader.loadMany(ids);
  }

  async loadUserById(id: DocId) {
    return this.userDataLoader.load(id);
  }
}
