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
import { DocIdScalar } from 'src/db/scalars/doc-id.scalar';
import { DocId } from 'src/db/types/doc-id.type';
import { CurrentUser } from 'src/graphql/decorators/current-user.decorator';
import { UserDocument } from 'src/users/schemas/user.schema';
import { Product } from 'src/products/schemas/product.schema';
import { ProductVariant } from 'src/products/schemas/product-variant.schema';

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
    return this.cartService.loadProductsById(cart.product);
  }

  @ResolveField(() => ProductVariant)
  async productVariant(@Parent() cart: CartDocument): Promise<ProductVariant> {
    return this.cartService.getProductVariantById(
      cart.product,
      cart.productVariant,
    );
  }
}
