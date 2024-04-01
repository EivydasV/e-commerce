import { Module } from '@nestjs/common';
import { CartResolver } from './resolvers/cart.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './schemas/cart.schema';
import { CartRepository } from './repositories/cart.repository';
import { CartService } from './services/cart.service';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
  ],
  providers: [CartResolver, CartRepository, CartService],
  exports: [CartRepository],
})
export class CartModule {}
