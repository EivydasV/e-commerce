import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { CreateCartInput } from '../inputs/create-cart.input';
import { CartService } from '../services/cart.service';
import { DocIdScalar } from '../../db/scalars/doc-id.scalar';
import { DocId } from '../../db/types/doc-id.type';
import { CurrentUser } from '../../graphql/decorators/current-user.decorator';
import { UserDocument } from '../../users/schemas/user.schema';
import { Product } from '../../products/schemas/product.schema';
import { ProductVariant } from '../../products/schemas/product-variant.schema';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}
  @Mutation(() => Boolean)
  async addToCart(
    @Args('createCartInput') createCartInput: CreateCartInput,
    @Args('productId', { type: () => [DocIdScalar] })
    productId: DocId,
    @Args('productVariantId', { type: () => [DocIdScalar] })
    productVariantId: DocId,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<boolean> {
    await this.cartService.addToCart(
      createCartInput,
      productId,
      productVariantId,
      currentUser,
    );

    return true;
  }

  @ResolveField(() => Product)
  async product(@Parent() cart: CartDocument): Promise<Product> {
    return this.cartService.getProductById(cart.product);
  }

  @ResolveField(() => ProductVariant)
  async productVariant(@Parent() cart: CartDocument): Promise<ProductVariant> {
    return this.cartService.getProductVariantById(
      cart.product,
      cart.productVariant,
    );
  }
}
