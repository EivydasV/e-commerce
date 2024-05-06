import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CategoryResolver } from '../category.resolver';
import { CategoryService } from '../../services/category.service';
import { Types } from 'mongoose';
import { Category } from '../../schemas/category.schema';

describe('CategoryResolver', () => {
  let categoryResolver: CategoryResolver;
  let categoryService: DeepMocked<CategoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryResolver],
    })
      .useMocker(createMock)
      .compile();

    categoryResolver = module.get<CategoryResolver>(CategoryResolver);
    categoryService = module.get<DeepMocked<CategoryService>>(CategoryService);
  });

  it('should be defined', async () => {
    expect(categoryResolver).toBeDefined();
  });

  describe('createCategory', () => {
    it('should create new category without parent', async () => {
      const createCategoryInput = {
        name: 'Category',
      };
      const docId = new Types.ObjectId();

      const result = createMock<Category>({
        ...createCategoryInput,
        _id: docId,
      });

      categoryService.create.mockResolvedValueOnce(result);

      const create = await categoryResolver.createCategory(
        createCategoryInput,
        undefined,
      );

      expect(categoryService.create).toHaveBeenCalledTimes(1);
      expect(categoryService.create).toHaveBeenCalledWith(
        createCategoryInput,
        undefined,
      );
      expect(create).toBe(result);
    });

    it('should create new category with parent', async () => {
      const createCategoryInput = {
        name: 'Category',
      };
      const docId = new Types.ObjectId();

      const result = createMock<Category>({
        ...createCategoryInput,
        _id: docId,
        parent: docId,
      });

      categoryService.create.mockResolvedValueOnce(result);

      const create = await categoryResolver.createCategory(
        createCategoryInput,
        docId,
      );

      expect(categoryService.create).toHaveBeenCalledTimes(1);
      expect(categoryService.create).toHaveBeenCalledWith(
        createCategoryInput,
        docId,
      );
      expect(create).toBe(result);
    });
  });
});
