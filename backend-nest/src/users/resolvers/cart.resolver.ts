import { ResolveField, Resolver } from '@nestjs/graphql';
import { UserDocument } from '../schemas/user.schema';
import { CartService } from '../services/cart.service';
import { Cart } from '../../cart/schemas/cart.schema';
import { CurrentUser } from '../../graphql/decorators/current-user.decorator';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @ResolveField(() => [Cart])
  async cart(@CurrentUser() currentUser: UserDocument): Promise<Cart[]> {
    return this.cartService.getCartByUser(currentUser);
  }
}
