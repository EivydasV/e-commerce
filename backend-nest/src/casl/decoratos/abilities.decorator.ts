import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from 'src/graphql/types/graphql-context.type';

export const Abilities = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    const abilities = ctx.req?.abilities;
    if (!abilities) {
      throw new UnauthorizedException();
    }

    return abilities;
  },
);
