import { Module } from '@nestjs/common';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { SecurityModule } from '../security/security.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../graphql/guards/auth.guard';

@Module({
  imports: [UsersModule, SecurityModule],
  providers: [
    AuthResolver,
    AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}
