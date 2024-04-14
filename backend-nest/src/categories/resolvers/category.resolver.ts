import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CategoryService } from '../services/category.service';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CreateCategoryInput } from '../inputs/create-category.input';
import { DocIdScalar } from '../../db/scalars/doc-id.scalar';
import { DocId } from '../../db/types/doc-id.type';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoriesService: CategoryService) {}

  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
    @Args('parentId', {
      type: () => DocIdScalar,
      nullable: true,
    })
    parentId?: DocId,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryInput, parentId);
  }

  @Query(() => [Category])
  async categories() {
    return this.categoriesService.find();
  }

  @ResolveField(() => Category)
  async parent(@Parent() category: CategoryDocument): Promise<Category | null> {
    return this.categoriesService.loadById(category.parent);
  }
}
