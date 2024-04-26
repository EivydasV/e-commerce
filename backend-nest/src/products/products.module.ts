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
import { PostSaveProductListener } from './listeners/post-save-product.listener';
import { ProductSearchService } from './services/product-search.service';
import { ProductSearchResolver } from './resolvers/product-search.resolver';
import { ElasticsearchToProductMapper } from './mappers/elasticsearch-to-product.mapper';
import { productEventsConstant } from './constants/product-events.constant';
import { EventEmitter } from '../db/emitters/event.emitter';

@Module({
  imports: [
    CategoryModule,
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
    MongooseModule.forFeatureAsync([
      {
        inject: [EventEmitter],
        name: Product.name,
        useFactory: (eventEmitter: EventEmitter) => {
          return eventEmitter.emitEvents(ProductSchema, {
            postCreated: productEventsConstant.postCreated,
            postUpdated: productEventsConstant.postUpdated,
          });
        },
      },
    ]),
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
    PostSaveProductListener,
    ProductSearchService,
    ProductSearchResolver,
    ElasticsearchToProductMapper,
  ],
  exports: [ProductRepository],
})
export class ProductsModule {}
