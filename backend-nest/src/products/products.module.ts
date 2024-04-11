import { Module } from '@nestjs/common';
import { ProductResolver } from './resolvers/product.resolver';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductVariantResolver } from './resolvers/product-variant.resolver';
import { ProductVariantService } from './services/product-variant.service';
import { CategoryModule } from '../categories/categoryModule';
import {
  ProductVariant,
  ProductVariantSchema,
} from './schemas/product-variant.schema';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ProductsIndexCommand } from './commands/products-index.command';
import { ProductElasticsearchRepository } from './repositories/product-elasticsearch.repository';
import { PostProductListener } from './listeners/post-product.listener';

@Module({
  imports: [
    CategoryModule,
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: ProductVariant.name, schema: ProductVariantSchema },
    ]),
  ],
  providers: [
    ProductResolver,
    ProductService,
    ProductRepository,
    ProductVariantResolver,
    ProductVariantService,
    ProductsIndexCommand,
    ProductElasticsearchRepository,
    PostProductListener,
  ],
  exports: [ProductRepository],
})
export class ProductsModule {}
