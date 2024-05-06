import { MongoQuery, SubjectRawRule } from '@casl/ability';
import { UserDocument } from 'src/users/schemas/user.schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ActionEnum } from '../enums/action.enum';
import { RoleRepository } from 'src/role/repository/role.repository';
import { superAdminConstant } from '../constants/super-admin.constant';
import { createAbility } from 'src/casl/helpers/create-abilities.helper';
import Mustache from 'mustache';
import { SubjectEnum } from 'src/casl/enums/subject.enum';

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly roleRepository: RoleRepository) {}

  async createForUser(user: UserDocument) {
    const role = await this.roleRepository.findById(user.role!);

    if (!role) {
      throw new UnauthorizedException();
    }

    const abilities = createAbility([]);

    const permissions:
      | SubjectRawRule<ActionEnum, SubjectEnum, MongoQuery>[]
      | undefined =
      role.permissions?.map((permission) => {
        if (permission.conditions) {
          permission.conditions = JSON.parse(
            Mustache.render(JSON.stringify(permission.conditions), {
              user: {
                id: user._id.toString(),
              },
            }),
          );
        }

        return {
          conditions: permission.conditions,
          subject: permission.subject,
          action: permission.action,
        };
      }) || [];

    if (role.name === superAdminConstant) {
      abilities.update([
        { subject: SubjectEnum.All, action: ActionEnum.Manage },
      ]);

      return abilities;
    }

    abilities.update(permissions);

    return abilities;
  }
}
