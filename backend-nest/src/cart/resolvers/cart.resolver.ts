import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Cart } from '../schemas/cart.schema';
import { CreateCartInput } from '../inputs/create-cart.input';
import { CartService } from '../services/cart.service';
import { DocIdScalar } from '../../db/scalars/doc-id.scalar';
import { DocId } from '../../db/types/doc-id.type';
import { CurrentUser } from '../../graphql/decorators/current-user.decorator';
import { UserDocument } from '../../users/schemas/user.schema';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}
  @Mutation(() => [Cart])
  async addToCart(
    @Args('createCartInput') createCartInput: CreateCartInput,
    @Args('productId', { type: () => [DocIdScalar] })
    productId: DocId,
    @Args('productVariantId', { type: () => [DocIdScalar] })
    productVariantId: DocId,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<Cart[]> {
    return this.cartService.addToCart(
      createCartInput,
      productId,
      productVariantId,
      currentUser,
    );
  }
}
