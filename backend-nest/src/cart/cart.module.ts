import { Module } from '@nestjs/common';
import { CartResolver } from './resolvers/cart.resolver';
import { PaginationsModule } from '../paginations/paginations.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './schemas/cart.schema';
import { CartRepository } from './repositories/cart.repository';

@Module({
  imports: [
    PaginationsModule,
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
  ],
  providers: [CartResolver, CartRepository],
})
export class CartModule {}
