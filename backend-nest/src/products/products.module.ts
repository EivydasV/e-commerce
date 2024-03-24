import { Module } from '@nestjs/common';
import { ProductResolver } from './resolvers/product.resolver';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductVariantResolver } from './resolvers/product-variant.resolver';
import { ProductVariantService } from './services/product-variant.service';
import { CategoryModule } from '../categories/categoryModule';

@Module({
  imports: [
    CategoryModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [
    ProductResolver,
    ProductService,
    ProductRepository,
    ProductVariantResolver,
    ProductVariantService,
  ],
})
export class ProductsModule {}
