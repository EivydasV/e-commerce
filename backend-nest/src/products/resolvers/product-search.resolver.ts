import { Args, Query, Resolver } from '@nestjs/graphql';
import { Product } from '../schemas/product.schema';
import { ProductSearchService } from '../services/product-search.service';

@Resolver(() => Product)
export class ProductSearchResolver {
  constructor(private readonly productSearchService: ProductSearchService) {}

  @Query(() => [String])
  async autoComplete(@Args('query') query: string) {}
}
