import { Resolver } from '@nestjs/graphql';
import { Cart } from '../schemas/cart.schema';

@Resolver(() => Cart)
export class CartResolver {}
