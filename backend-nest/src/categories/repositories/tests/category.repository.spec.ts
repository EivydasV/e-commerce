import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CategoryRepository } from '../category.repository';
import { Model, Types } from 'mongoose';
import { Category } from '../../schemas/category.schema';
import { getModelToken } from '@nestjs/mongoose';

describe('CategoryRepository', () => {
  let categoryRepository: CategoryRepository;
  let categoryModel: DeepMocked<Model<Category>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryRepository,
        {
          provide: getModelToken(Category.name),
          useValue: createMock<Model<Category>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);

    categoryModel = module.get<DeepMocked<Model<Category>>>(
      getModelToken(Category.name),
    );
  });

  it('should be defined', async () => {
    expect(categoryRepository).toBeDefined();
  });

  describe('findByParent', () => {
    it('should find category by parent', async () => {
      const parentId = new Types.ObjectId();
      const result = createMock<Category>({ parent: parentId });
      categoryModel.findOne.mockResolvedValueOnce(result);

      const find = await categoryRepository.findByParent(parentId);

      expect(categoryModel.findOne).toHaveBeenCalledTimes(1);
      expect(categoryModel.findOne).toHaveBeenCalledWith({ parent: parentId });
      expect(find).toBe(result);
    });
  });
});
