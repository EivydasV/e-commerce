import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResolver } from './resolvers/user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { SecurityModule } from '../security/security.module';
import { PaginationsModule } from '../paginations/paginations.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SecurityModule,
    PaginationsModule,
  ],
  providers: [UserResolver, UsersService, UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}