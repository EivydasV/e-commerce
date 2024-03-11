import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from '../../auth/decorators/public.decorator';
import { GraphQLContext } from '../types/graphql-context.type';
import { UserRepository } from '../../users/repositories/user.repository';
import Session from 'supertokens-node/recipe/session';
import { Types } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userRepository: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const ctx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    const req = ctx.req;
    const res = ctx.res;
    let userId: string | undefined;
    try {
      const session = await Session.getSession(req, res, {
        sessionRequired: false,
        checkDatabase: true,
      });

      userId = session !== undefined ? session.getUserId() : undefined;
    } catch (err) {
      if (Session.Error.isErrorFromSuperTokens(err)) {
        throw new UnauthorizedException();
      }

      throw new InternalServerErrorException();
    }

    if (!userId) {
      throw new UnauthorizedException();
    }
    const parseMongoId = new Types.ObjectId(userId);

    const user = await this.userRepository.findById(parseMongoId);

    if (!user) {
      throw new UnauthorizedException();
    }

    req.user = user;

    return true;
  }
}
