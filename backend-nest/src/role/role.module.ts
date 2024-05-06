import { Module } from '@nestjs/common';
import { RoleRepository } from './repository/role.repository';
import { RoleResolver } from './resolver/role.resolver';
import { RoleService } from './service/role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schema/role.schema';
import { PermissionResolver } from './resolver/permission.resolver';
import { PermissionService } from './service/permission.service';
import { PermissionConditionBuilder } from 'src/role/builders/permission-condition.builder';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  providers: [
    RoleRepository,
    RoleResolver,
    RoleService,
    PermissionResolver,
    PermissionService,
    PermissionConditionBuilder,
  ],
  exports: [RoleRepository],
})
export class RoleModule {}
