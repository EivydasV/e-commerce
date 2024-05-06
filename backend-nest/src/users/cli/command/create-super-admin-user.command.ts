import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { CreateSuperAdminUserQuestions } from '../question-set/create-super-admin-user.question-set';
import { RoleRepository } from '../../../role/repository/role.repository';
import { superAdminConstant } from '../../../casl/constants/super-admin.constant';
import { DocId } from '../../../db/types/doc-id.type';
import { UserService } from '../../services/user.service';

@Command({
  name: 'user:create:super:admin:user',
  description: `Create a super admin user and "${superAdminConstant}" role`,
})
export class CreateSuperAdminUserCommand extends CommandRunner {
  constructor(
    private readonly inquirer: InquirerService,
    private readonly userService: UserService,
    private readonly roleRepository: RoleRepository,
  ) {
    super();
  }

  async run(): Promise<void> {
    const user = await this.askUserQuestions();

    if (user.password !== user.reEnterPassword) {
      throw new Error('Passwords do not match');
    }

    let superAdminRoleId: DocId;

    superAdminRoleId = (await this.getSuperAdminRole())?._id;

    if (!superAdminRoleId) {
      superAdminRoleId = (await this.createSuperAdminRole())._id;
    }

    await this.userService.createUser({
      ...user,
      role: superAdminRoleId,
    });

    console.log('User created successfully');
  }

  private async askUserQuestions() {
    return this.inquirer.ask<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      reEnterPassword: string;
    }>(CreateSuperAdminUserQuestions.name, undefined);
  }

  private async createSuperAdminRole() {
    return this.roleRepository.create({
      name: superAdminConstant,
    });
  }

  private async getSuperAdminRole() {
    return this.roleRepository.findByName(superAdminConstant);
  }
}
