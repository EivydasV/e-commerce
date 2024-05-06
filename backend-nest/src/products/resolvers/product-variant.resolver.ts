import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductVariantService } from '../services/product-variant.service';
import { CreateProductVariantInput } from '../inputs/create-product-variant.input';
import { Product } from '../schemas/product.schema';
import { DocId } from 'src/db/types/doc-id.type';
import { DocIdScalar } from 'src/db/scalars/doc-id.scalar';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { ActionEnum } from 'src/casl/enums/action.enum';
import { SubjectEnum } from 'src/casl/enums/subject.enum';
import { Abilities } from 'src/casl/decoratos/abilities.decorator';
import { AppAbility } from 'src/casl/types/app-ability.type';

@Resolver(() => Product)
export class ProductVariantResolver {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @CheckPolicies((ability) =>
    ability.can(ActionEnum.Create, SubjectEnum.Product),
  )
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
    @Abilities() abilities: AppAbility,
  ) {
    return this.productVariantService.create(
      productVariantInput,
      productId,
      abilities,
    );
  }

  @CheckPolicies((ability) =>
    ability.can(ActionEnum.Delete, SubjectEnum.Product),
  )
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
    @Abilities() abilities: AppAbility,
  ) {
    return this.productVariantService.remove(variantId, productId, abilities);
  }
}
