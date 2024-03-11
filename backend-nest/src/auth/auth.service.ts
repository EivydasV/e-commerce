import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../users/repositories/user.repository';
import { LoginInput } from './inputs/login.input';
import { BaseHashing } from '../security/hashings/base.hashing';
import { GraphQLContext } from '../graphql/types/graphql-context.type';
import { createNewSession } from 'supertokens-node/lib/build/recipe/session';
import supertokens from 'supertokens-node';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: BaseHashing,
  ) {}

  async login(loginInput: LoginInput, ctx: GraphQLContext) {
    const user = await this.userRepository.findByEmail(loginInput.email);
    const error = new BadRequestException('Invalid credentials');
    if (!user) throw error;
    const isValidPassword = await this.hashingService.compare(
      loginInput.password,
      user.password,
    );
    if (!isValidPassword) throw error;
    await createNewSession(
      ctx.req,
      ctx.res,
      'public',
      supertokens.convertToRecipeUserId(user._id.toString()),
    );

    return user;
  }
}
