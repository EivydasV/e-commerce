import { Args, Query, Resolver } from '@nestjs/graphql';
import { OffsetPaginatedProduct, Product } from '../schemas/product.schema';
import { ProductSearchService } from '../services/product-search.service';
import { AutocompleteModel } from '../models/autocomplete.model';
import { ElasticSearchToGraphqlTransformer } from '../../elasticsearch/transformers/graphql-transformer';
import { SearchProductInput } from '../inputs/search-product.input';
import { OffsetPaginationInput } from '../../graphql/inputs/offset-pagination.input';
@Resolver(() => Product)
export class ProductSearchResolver {
  constructor(
    private readonly productSearchService: ProductSearchService,
    private readonly elasticSearchToGraphqlTransformer: ElasticSearchToGraphqlTransformer,
  ) {}

  @Query(() => AutocompleteModel)
  async autoComplete(@Args('query') query: string): Promise<AutocompleteModel> {
    const autoComplete = await this.productSearchService.autoComplete(query);

    return this.elasticSearchToGraphqlTransformer.transform(autoComplete);
  }

  @Query(() => OffsetPaginatedProduct)
  async searchProducts(
    @Args('paginate', { nullable: true })
    offsetPaginationInput: OffsetPaginationInput,

    @Args('searchProductInputs', { nullable: true })
    searchProductInputs?: SearchProductInput,
  ): Promise<OffsetPaginatedProduct> {
    return this.productSearchService.searchProducts(
      offsetPaginationInput,
      searchProductInputs,
    );
  }
}
