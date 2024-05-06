import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Role, RoleDocument } from '../schema/role.schema';
import { RoleService } from '../service/role.service';
import { CreateRoleInput } from '../inputs/create-role.input';
import { UpdateRoleInput } from 'src/role/inputs/update-role.input';
import { DocId } from 'src/db/types/doc-id.type';
import { DocIdScalar } from 'src/db/scalars/doc-id.scalar';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { ActionEnum } from 'src/casl/enums/action.enum';
import { SubjectEnum } from 'src/casl/enums/subject.enum';

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @CheckPolicies((ability) => ability.can(ActionEnum.Create, SubjectEnum.Role))
  @Mutation(() => Boolean)
  async createRole(
    @Args('createRoleInput') createRoleInput: CreateRoleInput,
  ): Promise<boolean> {
    await this.roleService.create(createRoleInput);

    return true;
  }

  @CheckPolicies((ability) => ability.can(ActionEnum.Update, SubjectEnum.Role))
  @Mutation(() => Boolean)
  async assignRoleToUser(
    @Args('roleId', { type: () => DocIdScalar }) roleId: DocId,
    @Args('userId', { type: () => DocIdScalar }) userId: DocId,
  ): Promise<boolean> {
    await this.roleService.assignRole(roleId, userId);

    return true;
  }

  @CheckPolicies((ability) => ability.can(ActionEnum.Update, SubjectEnum.Role))
  @Mutation(() => Boolean)
  async updateRole(
    @Args('roleId', { type: () => DocIdScalar }) id: DocId,
    @Args('updateRoleInput') updateRoleInput: UpdateRoleInput,
  ): Promise<RoleDocument> {
    return this.roleService.update(id, updateRoleInput);
  }

  @CheckPolicies((ability) => ability.can(ActionEnum.Delete, SubjectEnum.Role))
  @Mutation(() => Boolean)
  async deleteRole(
    @Args('roleId', { type: () => DocIdScalar }) roleId: DocId,
  ): Promise<boolean> {
    await this.roleService.delete(roleId);

    return true;
  }

  @CheckPolicies((ability) => ability.can(ActionEnum.Read, SubjectEnum.Role))
  @Query(() => [Role])
  async getRoles(): Promise<RoleDocument[]> {
    return this.roleService.findAll();
  }

  @CheckPolicies((ability) => ability.can(ActionEnum.Read, SubjectEnum.Role))
  @Query(() => Role)
  async getRoleByName(@Args('name') name: string): Promise<RoleDocument> {
    return this.roleService.findByName(name);
  }
}
