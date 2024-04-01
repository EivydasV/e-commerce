import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UserResolver } from './resolvers/user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { SecurityModule } from '../security/security.module';
import { CartResolver } from './resolvers/cart.resolver';
import { CartModule } from '../cart/cart.module';
import { CartService } from './services/cart.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SecurityModule,
    CartModule,
  ],
  providers: [
    UserResolver,
    UsersService,
    UserRepository,
    CartResolver,
    CartService,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
