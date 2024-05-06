import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from '../repository/role.repository';
import { CreateRoleInput } from '../inputs/create-role.input';
import { UpdateRoleInput } from 'src/role/inputs/update-role.input';
import { DocId } from 'src/db/types/doc-id.type';
import { superAdminConstant } from 'src/casl/constants/super-admin.constant';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async create(createRoleInput: CreateRoleInput) {
    if (createRoleInput.name === superAdminConstant) {
      throw new BadRequestException(
        `Role with name "${superAdminConstant}" is reserved`,
      );
    }

    const findExistingRole = await this.roleRepository.findByName(
      createRoleInput.name,
    );

    if (findExistingRole) {
      throw new BadRequestException(
        `role with name "${createRoleInput.name}" already exist`,
      );
    }

    return this.roleRepository.create(createRoleInput);
  }

  async findAll() {
    return this.roleRepository.findAll();
  }

  async findByName(name: string) {
    return this.roleRepository.findByName(name);
  }

  async update(id: DocId, updateRoleInput: UpdateRoleInput) {
    if (updateRoleInput.name === superAdminConstant) {
      throw new BadRequestException(
        `Role with name "${superAdminConstant}" is reserved`,
      );
    }

    const updatedRole = await this.roleRepository.findByIdAndUpdate(
      id,
      updateRoleInput,
    );

    if (!updatedRole) {
      throw new NotFoundException(`Role with id "${id}" not found`);
    }

    return updatedRole;
  }

  async assignRole(roleId: DocId, userId: DocId) {
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new NotFoundException(`Role with id "${roleId}" not found`);
    }

    const updateUser = await this.roleRepository.findByIdAndUpdate(userId, {
      role: roleId,
    });

    if (!updateUser) {
      throw new NotFoundException(`User with id "${userId}" not found`);
    }

    return updateUser;
  }

  async delete(roleId: DocId) {
    const deleteRole = await this.roleRepository.findByIdAndDelete(roleId);

    if (!deleteRole) {
      throw new NotFoundException(`Role with id "${roleId}" not found`);
    }

    return true;
  }
}
