import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductVariantService } from '../services/product-variant.service';
import { CreateProductVariantInput } from '../inputs/create-product-variant.input';
import { UserDocument } from '../../users/schemas/user.schema';
import { CurrentUser } from '../../graphql/decorators/current-user.decorator';
import { Product } from '../schemas/product.schema';
import { ParseMongoIdPipe } from '../../db/pipes/parse-mongo-id.pipe';
import { DocId } from '../../db/types/doc-id.type';
import { DocIdScalar } from '../../db/scalars/doc-id.scalar';

@Resolver(() => Product)
export class ProductVariantResolver {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Mutation(() => Product)
  async createProductVariant(
    @Args('productVariantInput', {
      type: () => [CreateProductVariantInput],
    })
    productVariantInput: CreateProductVariantInput[],
    @Args('productId', {
      type: () => DocIdScalar,
    })
    productId: DocId,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.productVariantService.create(
      productVariantInput,
      productId,
      currentUser._id,
    );
  }

  @Mutation(() => Product)
  async removeProductVariant(
    @Args('variantId', {
      type: () => DocIdScalar,
    })
    variantId: DocId,
    @Args('productId', {
      type: () => DocIdScalar,
    })
    productId: DocId,
    @CurrentUser() currentUser: UserDocument,
  ) {
    return this.productVariantService.remove(
      variantId,
      productId,
      currentUser._id,
    );
  }
}
