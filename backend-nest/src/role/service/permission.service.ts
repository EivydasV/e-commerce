import { RoleRepository } from '../repository/role.repository';
import { CreatePermissionInput } from '../inputs/create-permission.input';
import { DocId } from 'src/db/types/doc-id.type';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntitySearch } from 'src/db/search/entity.search';
import { PermissionConditionBuilder } from 'src/role/builders/permission-condition.builder';

@Injectable()
export class PermissionService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly entitySearch: EntitySearch,
    private readonly permissionConditionBuilder: PermissionConditionBuilder,
  ) {}

  async create(createPermissionInput: CreatePermissionInput, roleId: DocId) {
    const role = await this.findByIdOrFail(roleId);

    const existingPermission = role?.permissions?.filter(
      (permission) =>
        permission.action === createPermissionInput.action &&
        permission.subject === createPermissionInput.subject,
    );

    if (existingPermission?.length) {
      throw new ConflictException('Permission already exists');
    }

    const getEntity = await this.entitySearch.getEntity(
      createPermissionInput.subject,
    );

    if (!getEntity) {
      throw new NotFoundException('Subject not found');
    }

    const conditions = this.permissionConditionBuilder.build(
      createPermissionInput.conditions,
    );

    const fields = this.entitySearch.getEntityFieldsThatHasRef(getEntity);

    if (conditions) {
      const include = fields.every((field) =>
        Object.keys(conditions).includes(field),
      );

      if (!include) {
        throw new NotFoundException('Condition field not found');
      }
    }

    return this.roleRepository.addPermission(role, {
      ...createPermissionInput,
      conditions,
    });
  }

  async remove(permissionId: DocId, roleId: DocId) {
    const role = await this.findByIdOrFail(roleId);

    return this.roleRepository.removePermission(role, permissionId);
  }

  private async findByIdOrFail(id: DocId) {
    const role = await this.roleRepository.findById(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }
}
