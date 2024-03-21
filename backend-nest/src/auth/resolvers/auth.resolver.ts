import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {LoginInput} from '../inputs/login.input';
import {Public} from '../decorators/public.decorator';
import {AuthService} from '../auth.service';
import {GraphQLContext} from '../../graphql/types/graphql-context.type';
import {CurrentUser} from '../../graphql/decorators/current-user.decorator';
import {User} from '../../users/schemas/user.schema';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => Boolean)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() ctx: GraphQLContext,
  ): Promise<boolean> {
    await this.authService.login(loginInput, ctx);

    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: GraphQLContext): Promise<boolean> {
    await ctx.session?.revokeSession();

    return true;
  }

  @Query(() => User)
  async me(@CurrentUser() currentUser: User): Promise<User> {
    return currentUser;
  }
}
