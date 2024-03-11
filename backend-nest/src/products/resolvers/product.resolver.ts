import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {
  OffsetPaginatedProduct,
  Product,
  ProductDocument,
} from '../schemas/product.schema';
import { ProductService } from '../services/product.service';
import { CreateProductInput } from '../inputs/create-product.input';
import { CurrentUser } from '../../graphql/decorators/current-user.decorator';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { OffsetPaginationInput } from '../../graphql/inputs/offset-pagination.input';
import { DocIdScalar } from '../../db/scalars/doc-id.scalar';
import { DocId } from '../../db/types/doc-id.type';
import { UpdateProductInput } from '../inputs/update-product.input';
import { Category } from '../../categories/schemas/category.schema';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => Product, { nullable: true })
  async findProductBySlug(@Args('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @Args('categoryIds', { type: () => [DocIdScalar] }) categoryIds: DocId[],
    @CurrentUser() currentUser: UserDocument,
  ): Promise<Product> {
    return this.productService.create(
      createProductInput,
      categoryIds,
      currentUser._id,
    );
  }

  @Query(() => OffsetPaginatedProduct)
  async findProductsBySeller(
    @Args('paginate', { nullable: true })
    offsetPaginationInput: OffsetPaginationInput,
    @Args('sellerId', {
      type: () => DocIdScalar,
    })
    sellerId: DocId,
  ): Promise<OffsetPaginatedProduct> {
    return this.productService.paginate(offsetPaginationInput, sellerId);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('productId', {
      type: () => DocIdScalar,
    })
    productId: DocId,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.productService.update(
      productId,
      currentUser._id,
      updateProductInput,
    );
  }

  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('productId', {
      type: () => DocIdScalar,
    })
    productId: DocId,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<boolean> {
    await this.productService.delete(productId, currentUser._id);

    return true;
  }

  @ResolveField(() => [Category])
  async categories(@Parent() product: ProductDocument): Promise<Category[]> {
    console.log('categories');
    return this.productService.findCategories(product);
  }

  @ResolveField(() => User)
  async seller(@Parent() product: ProductDocument): Promise<User> {
    return this.productService.findSeller(product);
  }
}
