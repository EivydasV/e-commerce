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
import { CurrentUser } from 'src/graphql/decorators/current-user.decorator';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { OffsetPaginationInput } from 'src/graphql/inputs/offset-pagination.input';
import { DocIdScalar } from 'src/db/scalars/doc-id.scalar';
import { DocId } from 'src/db/types/doc-id.type';
import { UpdateProductInput } from '../inputs/update-product.input';
import { Category } from 'src/categories/schemas/category.schema';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { ActionEnum } from 'src/casl/enums/action.enum';
import { Abilities } from 'src/casl/decoratos/abilities.decorator';
import { AppAbility } from 'src/casl/types/app-ability.type';
import { SubjectEnum } from 'src/casl/enums/subject.enum';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @CheckPolicies((ability) => ability.can(ActionEnum.Read, SubjectEnum.Product))
  @Query(() => Product, { nullable: true })
  async findProductBySlug(@Args('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @CheckPolicies((ability) =>
    ability.can(ActionEnum.Create, SubjectEnum.Product),
  )
  @Mutation(() => Product)
  async createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @Args('categoryIds', { type: () => [DocIdScalar] }) categoryIds: DocId[],
    @CurrentUser() currentUser: UserDocument,
    @Abilities() abilities: AppAbility,
  ): Promise<Product> {
    return this.productService.create(
      createProductInput,
      categoryIds,
      currentUser._id,
      abilities,
    );
  }

  @CheckPolicies((ability) => ability.can(ActionEnum.Read, SubjectEnum.Product))
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

  @CheckPolicies((ability) =>
    ability.can(ActionEnum.Update, SubjectEnum.Product),
  )
  @Mutation(() => Product)
  async updateProduct(
    @Args('productId', {
      type: () => DocIdScalar,
    })
    productId: DocId,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
    @Abilities() abilities: AppAbility,
  ) {
    return this.productService.update(productId, updateProductInput, abilities);
  }

  @CheckPolicies((ability) =>
    ability.can(ActionEnum.Delete, SubjectEnum.Product),
  )
  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('productId', {
      type: () => DocIdScalar,
    })
    productId: DocId,
    @CurrentUser() currentUser: UserDocument,
    @Abilities() abilities: AppAbility,
  ): Promise<boolean> {
    await this.productService.delete(productId, currentUser._id, abilities);

    return true;
  }

  @ResolveField(() => [Category])
  async categories(
    @Parent() product: ProductDocument,
  ): Promise<(Category | Error)[]> {
    return this.productService.loadByIds(product.categories);
  }

  @ResolveField(() => User)
  async seller(@Parent() product: ProductDocument): Promise<User> {
    return this.productService.loadUserById(product.seller);
  }
}
