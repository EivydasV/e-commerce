import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserResolver } from './resolvers/user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserRepository } from './repositories/user.repository';
import { SecurityModule } from '../security/security.module';
import { CartModule } from '../cart/cart.module';
import { CommandRunnerModule } from 'nest-commander';
import { CreateSuperAdminUserCommand } from './cli/command/create-super-admin-user.command';
import { CreateSuperAdminUserQuestions } from './cli/question-set/create-super-admin-user.question-set';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SecurityModule,
    CartModule,
    CommandRunnerModule.forModule({
      module: UsersModule,
      imports: [RoleModule],
      providers: [CreateSuperAdminUserCommand, CreateSuperAdminUserQuestions],
    }),
  ],
  providers: [UserResolver, UserService, UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}
