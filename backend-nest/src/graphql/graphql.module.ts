import { Global, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UserDataLoader } from './data-loaders/user.data-loader';

@Global()
@Module({
  imports: [UsersModule],
  providers: [UserDataLoader],
  exports: [UserDataLoader],
})
export class GraphqlModule {}
