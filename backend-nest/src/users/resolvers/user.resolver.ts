import { Args, Mutation, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { UserService } from '../services/user.service';
import { CreateUserInput } from '../inputs/create-user.input';
import { Public } from '../../auth/decorators/public.decorator';
import {
  OffsetPaginatedUser,
  User,
  UserDocument,
} from '../schemas/user.schema';
import { UpdateUserInput } from '../inputs/update-user.input';
import { CurrentUser } from 'src/graphql/decorators/current-user.decorator';
import { ForgotPasswordInput } from '../inputs/forgot-password.input';
import { ResetPasswordInput } from '../inputs/reset-password.input';
import { OffsetPaginationInput } from 'src/graphql/inputs/offset-pagination.input';
import { Role } from 'src/role/schema/role.schema';
import { SubjectEnum } from 'src/casl/enums/subject.enum';
import { ActionEnum } from 'src/casl/enums/action.enum';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { Abilities } from 'src/casl/decoratos/abilities.decorator';
import { AppAbility } from 'src/casl/types/app-ability.type';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @CheckPolicies((ability) => ability.can(ActionEnum.Read, SubjectEnum.User))
  @Query(() => OffsetPaginatedUser)
  async findUsers(
    @Args('paginate', { nullable: true })
    offsetPaginationInput: OffsetPaginationInput,
  ): Promise<OffsetPaginatedUser> {
    return this.usersService.paginate(offsetPaginationInput);
  }

  @CheckPolicies((ability) => ability.can(ActionEnum.Read, SubjectEnum.User))
  @Query(() => User, { nullable: true })
  async findUserByEmail(
    @Args('email') email: string,
  ): Promise<UserDocument | null> {
    return this.usersService.findByEmail(email);
  }

  @Public()
  @Mutation(() => Boolean)
  async createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<boolean> {
    await this.usersService.createUser(createUserInput);

    return true;
  }

  @CheckPolicies((ability) => ability.can(ActionEnum.Update, SubjectEnum.User))
  @Mutation(() => Boolean)
  async updateUser(
    @Args('input') updateUserInput: UpdateUserInput,
    @CurrentUser() currentUser: UserDocument,
    @Abilities() abilities: AppAbility,
  ): Promise<boolean> {
    await this.usersService.updateUser(
      updateUserInput,
      currentUser._id,
      abilities,
    );

    return true;
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Args('input') forgotPasswordInput: ForgotPasswordInput,
  ) {
    await this.usersService.forgotPassword(forgotPasswordInput);

    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(@Args('input') resetPasswordInput: ResetPasswordInput) {
    await this.usersService.resetPassword(resetPasswordInput);

    return true;
  }

  @ResolveField(() => Role)
  async role(@CurrentUser() currentUser: UserDocument) {
    return this.usersService.populateRole(currentUser);
  }
}
