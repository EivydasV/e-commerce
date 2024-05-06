import { GraphQLExecutionContext } from '@nestjs/graphql';
import { SessionRequest } from 'supertokens-node/lib/build/framework/express';
import { Request, Response } from 'express';
import { UserDocument } from 'src/users/schemas/user.schema';
import { AppAbility } from 'src/casl/types/app-ability.type';

export type GraphQLContext = GraphQLExecutionContext & {
  req: Request & {
    user: UserDocument | null;
    abilities: AppAbility;
  };
  res: Response;
  session: SessionRequest['session'];
};
