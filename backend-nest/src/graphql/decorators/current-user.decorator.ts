import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../types/graphql-context.type';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    const user = ctx.req?.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  },
);
