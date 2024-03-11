import { GraphQLExecutionContext } from '@nestjs/graphql';
import { SessionRequest } from 'supertokens-node/lib/build/framework/express';
import { Request, Response } from 'express';
import { UserDocument } from '../../users/schemas/user.schema';

export type GraphQLContext = GraphQLExecutionContext & {
  req: Request & { user: UserDocument | null };
  res: Response;
  session: SessionRequest['session'];
};
