import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users.service';
import { CreateUserInput } from '../inputs/create-user.input';
import { Public } from '../../auth/decorators/public.decorator';
import {
  OffsetPaginatedUser,
  User,
  UserDocument,
} from '../schemas/user.schema';
import { UpdateUserInput } from '../inputs/update-user.input';
import { CurrentUser } from '../../graphql/decorators/current-user.decorator';
import { ForgotPasswordInput } from '../inputs/forgot-password.input';
import { ResetPasswordInput } from '../inputs/reset-password.input';
import { OffsetPaginationInput } from '../../graphql/inputs/offset-pagination.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => OffsetPaginatedUser)
  async findUsers(
    @Args('paginate', { nullable: true })
    offsetPaginationInput: OffsetPaginationInput,
  ) {
    return this.usersService.paginate(offsetPaginationInput);
  }

  @Query(() => User, { nullable: true })
  async findUserByEmail(@Args('email') email: string): Promise<User | null> {
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

  @Mutation(() => Boolean)
  async updateUser(
    @Args('input') updateUserInput: UpdateUserInput,
    @CurrentUser() currentUser: UserDocument,
  ): Promise<boolean> {
    await this.usersService.updateUser(currentUser._id, updateUserInput);

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
}
