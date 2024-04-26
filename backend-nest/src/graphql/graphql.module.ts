import { Global, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { UserDataLoader } from './data-loaders/user.data-loader';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DocIdScalar } from '../db/scalars/doc-id.scalar';
import { join } from 'node:path';
import { SessionRequest } from 'supertokens-node/lib/build/framework/express';
import { CategoryModule } from '../categories/categoryModule';
import { CategoryDataLoader } from './data-loaders/category.data-loader';
import { ProductDataLoader } from './data-loaders/product.data-loader';
import { ProductsModule } from '../products/products.module';
import { ElasticSearchToGraphqlTransformer } from '../elasticsearch/transformers/graphql-transformer';

@Global()
@Module({
  imports: [
    UsersModule,
    CategoryModule,
    ProductsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
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
    }),
  ],
  providers: [
    UserDataLoader,
    CategoryDataLoader,
    ProductDataLoader,
    ElasticSearchToGraphqlTransformer,
  ],
  exports: [
    UserDataLoader,
    CategoryDataLoader,
    ProductDataLoader,
    ElasticSearchToGraphqlTransformer,
  ],
})
export class GraphqlModule {}
