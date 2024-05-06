import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepository } from '../../repositories/category.repository';
import { CategoryDataLoader } from '../../../graphql/data-loaders/category.data-loader';
import { Types } from 'mongoose';
import { CategoryService } from '../category.service';
import { CreateCategoryInput } from '../../inputs/create-category.input';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Category, CategoryDocument } from '../../schemas/category.schema';
import { NotFoundException } from '@nestjs/common';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let categoryRepository: DeepMocked<CategoryRepository>;
  let categoryDataLoader: DeepMocked<CategoryDataLoader>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService],
    })
      .useMocker(createMock)
      .compile();

    categoryService = module.get<CategoryService>(CategoryService);
    categoryRepository =
      module.get<DeepMocked<CategoryRepository>>(CategoryRepository);
    categoryDataLoader =
      await module.resolve<DeepMocked<CategoryDataLoader>>(CategoryDataLoader);
  });

  it('should be defined', async () => {
    expect(categoryService).toBeDefined();
  });

  describe('create', () => {
    it('should create new category without parent', async () => {
      const createCategoryInput: CreateCategoryInput = {
        name: 'Category',
      };

      const result = createMock<Category>({
        ...createCategoryInput,
        _id: new Types.ObjectId(),
      });

      categoryRepository.create.mockResolvedValueOnce(result);

      const create = await categoryService.create(createCategoryInput);

      expect(categoryRepository.create).toHaveBeenCalledTimes(1);
      expect(categoryRepository.create).toHaveBeenCalledWith(
        createCategoryInput,
      );
      expect(create).toBe(result);
    });

    it('should throw NotFoundException when parent not found', async () => {
      const parentId = new Types.ObjectId();
      const createCategoryInput: CreateCategoryInput = {
        name: 'Category',
      };

      categoryRepository.findById.mockReturnValueOnce(null);

      await expect(
        categoryService.create(createCategoryInput, parentId),
      ).rejects.toThrow(NotFoundException);

      expect(categoryRepository.findById).toHaveBeenCalledTimes(1);
      expect(categoryRepository.findById).toHaveBeenCalledWith(parentId);
    });

    it('should create new category with parent', async () => {
      const parentId = new Types.ObjectId();
      const createCategoryInput: CreateCategoryInput = {
        name: 'Category',
      };

      const result = createMock<CategoryDocument>({
        ...createCategoryInput,
        _id: parentId,
        parent: parentId,
      });

      categoryRepository.findById.mockResolvedValueOnce(result);
      categoryRepository.create.mockResolvedValueOnce(result);

      const create = await categoryService.create(
        createCategoryInput,
        parentId,
      );

      expect(categoryRepository.findById).toHaveBeenCalledTimes(1);
      expect(categoryRepository.findById).toHaveBeenCalledWith(parentId);
      expect(categoryRepository.create).toHaveBeenCalledTimes(1);
      expect(categoryRepository.create).toHaveBeenCalledWith({
        ...createCategoryInput,
        parent: parentId,
      });
      expect(create).toBe(result);
    });
  });

  describe('find', () => {
    it('should find all categories', async () => {
      const result = createMock<CategoryDocument[]>([
        {
          _id: new Types.ObjectId(),
          name: 'Category',
        },
      ]);

      categoryRepository.findAll.mockResolvedValueOnce(result);

      const find = await categoryService.find();

      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
      expect(find).toBe(result);
    });
  });

  describe('loadById', () => {
    it('should return null when id is not provided', async () => {
      const load = await categoryService.loadById();

      expect(load).toBeNull();
    });

    it('should load category by id', async () => {
      const id = new Types.ObjectId();

      const result = createMock<CategoryDocument>({
        _id: id,
        name: 'Category',
      });

      categoryDataLoader.load.mockResolvedValueOnce(result);

      const load = await categoryService.loadById(id);

      expect(categoryDataLoader.load).toHaveBeenCalledTimes(1);
      expect(categoryDataLoader.load).toHaveBeenCalledWith(id);
      expect(load).toBe(result);
    });
  });
});
