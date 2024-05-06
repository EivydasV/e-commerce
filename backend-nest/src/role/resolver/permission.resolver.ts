import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PermissionService } from '../service/permission.service';
import { Role } from '../schema/role.schema';
import { CreatePermissionInput } from '../inputs/create-permission.input';
import { DocIdScalar } from 'src/db/scalars/doc-id.scalar';
import { DocId } from 'src/db/types/doc-id.type';
import * as util from 'node:util';

@Resolver(() => Role)
export class PermissionResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Mutation(() => Boolean)
  async createPermission(
    @Args('createPermissionInput') createPermissionInput: CreatePermissionInput,
    @Args('roleId', { type: () => DocIdScalar }) roleId: DocId,
  ): Promise<boolean> {
    await this.permissionService.create(createPermissionInput, roleId);

    return true;
  }

  @Mutation(() => Boolean)
  async removePermission(
    @Args('permissionId', { type: () => DocIdScalar }) permissionId: DocId,
    @Args('roleId', { type: () => DocIdScalar }) roleId: DocId,
  ): Promise<boolean> {
    await this.permissionService.remove(permissionId, roleId);

    return true;
  }
}
