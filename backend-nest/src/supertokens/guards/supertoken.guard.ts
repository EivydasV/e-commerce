import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Error as STError } from 'supertokens-node';

import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLContext } from '../../graphql/types/graphql-context.type';

@Injectable()
export class SupertokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx =
      GqlExecutionContext.create(context).getContext<GraphQLContext>();
    let err = undefined;
    const resp = ctx.res;

    // You can create an optional version of this by passing {sessionRequired: false} to verifySession
    await verifySession()(ctx.req, resp, (res) => {
      err = res;
    });

    if (resp.headersSent) {
      throw new STError({
        message: 'RESPONSE_SENT',
        type: 'RESPONSE_SENT',
      });
    }

    if (err) {
      throw err;
    }

    return true;
  }
}
