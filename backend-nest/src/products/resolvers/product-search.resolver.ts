import { Args, Query, Resolver } from '@nestjs/graphql';
import { OffsetPaginatedProduct, Product } from '../schemas/product.schema';
import { ProductSearchService } from '../services/product-search.service';
import { AutocompleteModel } from '../models/autocomplete.model';
import { ElasticSearchToGraphqlTransformer } from 'src/elasticsearch/transformers/graphql-transformer';
import { SearchProductInput } from '../inputs/search-product.input';
import { OffsetPaginationInput } from 'src/graphql/inputs/offset-pagination.input';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { ActionEnum } from 'src/casl/enums/action.enum';
import { SubjectEnum } from 'src/casl/enums/subject.enum';
@Resolver(() => Product)
export class ProductSearchResolver {
  constructor(
    private readonly productSearchService: ProductSearchService,
    private readonly elasticSearchToGraphqlTransformer: ElasticSearchToGraphqlTransformer,
  ) {}

  @CheckPolicies((ability) => ability.can(ActionEnum.Read, SubjectEnum.Product))
  @Query(() => AutocompleteModel)
  async autoComplete(@Args('query') query: string): Promise<AutocompleteModel> {
    const autoComplete = await this.productSearchService.autoComplete(query);

    return this.elasticSearchToGraphqlTransformer.transform(autoComplete);
  }

  @CheckPolicies((ability) => ability.can(ActionEnum.Read, SubjectEnum.Product))
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
