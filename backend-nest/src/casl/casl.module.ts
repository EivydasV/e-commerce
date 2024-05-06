import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './factories/casl-ability.factory';
import { RoleModule } from '../role/role.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { PoliciesGuard } from './guards/policie-guard.guard';
import { ForbiddenExceptionFilter } from 'src/casl/exception-filters/forbidden.exception.filter';

@Module({
  imports: [RoleModule],
  providers: [
    CaslAbilityFactory,
    { provide: APP_GUARD, useClass: PoliciesGuard },
    { provide: APP_FILTER, useClass: ForbiddenExceptionFilter },
  ],
})
export class CaslModule {}
