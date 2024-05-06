import { Injectable } from '@nestjs/common';
import { Role, RoleDocument } from '../schema/role.schema';
import { BaseRepository } from 'src/db/repositories/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseQuery } from 'src/db/types/query.type';
import { CreatePermissionInput } from '../inputs/create-permission.input';
import { DocId } from 'src/db/types/doc-id.type';
import { FilterInput } from 'src/role/inputs/filter-input';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(@InjectModel(Role.name) private readonly roleModel: Model<Role>) {
    super(roleModel);
  }

  findByName(name: string): MongooseQuery<RoleDocument> {
    return this.roleModel.findOne({ name });
  }

  async addPermission(
    role: RoleDocument,
    permission: Omit<CreatePermissionInput, 'conditions'> & {
      conditions?: Record<string, FilterInput>;
    },
  ): Promise<RoleDocument> {
    role?.permissions?.push(permission);

    return role.save();
  }

  async removePermission(
    role: RoleDocument,
    permissionId: DocId,
  ): Promise<RoleDocument> {
    role?.permissions?.pull(permissionId);

    return role.save();
  }
}
