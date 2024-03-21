import { Global, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UserDataLoader } from './data-loaders/user.data-loader';
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {DocIdScalar} from "../db/scalars/doc-id.scalar";
import {join} from "node:path";
import {SessionRequest} from "supertokens-node/lib/build/framework/express";

@Global()
@Module({
  imports: [UsersModule,     GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    resolvers: { DocId: DocIdScalar },
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,

    buildSchemaOptions: {
      numberScalarMode: 'integer',
    },
    playground: {
      settings: {
        'request.credentials': 'include', // Otherwise cookies won't be sent
      },
    },
    context: ({ req, res }: { req: SessionRequest; res: Response }) => {
      return {
        session: req.session,
        req,
        res,
      };
    },
  }),],
  providers: [UserDataLoader],
  exports: [UserDataLoader],
})
export class GraphqlModule {}
