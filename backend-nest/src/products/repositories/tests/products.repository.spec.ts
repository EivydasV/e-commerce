import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Model, Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ProductRepository } from '../product.repository';
import { Product, ProductDocument } from '../../schemas/product.schema';

describe('ProductRepository', () => {
  let productRepository: ProductRepository;
  let productModel: DeepMocked<Model<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getModelToken(Product.name),
          useValue: createMock<Model<Product>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();
    productRepository = module.get<ProductRepository>(ProductRepository);

    productModel = module.get<DeepMocked<Model<Product>>>(
      getModelToken(Product.name),
    );
  });

  it('should be defined', async () => {
    expect(productRepository).toBeDefined();
  });

  describe('findByTitle', () => {
    it('should return a product by title', async () => {
      const title = 'Product title';

      const productDocument = createMock<ProductDocument>();
      productModel.findOne.mockResolvedValueOnce(productDocument);

      const result = await productRepository.findByTitle(title);

      expect(result).toBe(productDocument);
      expect(productModel.findOne).toHaveBeenCalledWith({ title });
    });

    it('should return null if product not found', async () => {
      const title = 'Product title';
      productModel.findOne.mockResolvedValueOnce(null);

      const result = await productRepository.findByTitle(title);

      expect(result).toBeNull();
      expect(productModel.findOne).toHaveBeenCalledWith({ title });
    });
  });

  describe('findBySlug', () => {
    it('should return a product by slug', async () => {
      const slug = 'product-slug';

      const productDocument = createMock<ProductDocument>();
      productModel.findOne.mockResolvedValueOnce(productDocument);

      const result = await productRepository.findBySlug(slug);

      expect(result).toBe(productDocument);
      expect(productModel.findOne).toHaveBeenCalledWith({ slug });
    });

    it('should return null if product not found', async () => {
      const slug = 'product-slug';
      productModel.findOne.mockResolvedValueOnce(null);

      const result = await productRepository.findBySlug(slug);

      expect(result).toBeNull();
      expect(productModel.findOne).toHaveBeenCalledWith({ slug });
    });
  });

  describe('findBySeller', () => {
    it('should return a product by seller', async () => {
      const seller = new Types.ObjectId();

      const productDocument = createMock<ProductDocument>();
      productModel.findOne.mockResolvedValueOnce(productDocument);

      const result = await productRepository.findBySeller(seller);

      expect(result).toBe(productDocument);
      expect(productModel.findOne).toHaveBeenCalledWith({ seller });
    });

    it('should return null if product not found', async () => {
      const seller = new Types.ObjectId();
      productModel.findOne.mockResolvedValueOnce(null);

      const result = await productRepository.findBySeller(seller);

      expect(result).toBeNull();
      expect(productModel.findOne).toHaveBeenCalledWith({ seller });
    });
  });
});
