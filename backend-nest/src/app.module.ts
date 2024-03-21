import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { SecurityModule } from './security/security.module';
import { AuthModule } from './auth/auth.module';
import { SupertokenModule } from './supertokens/supertoken.module';
import { GraphqlModule } from './graphql/graphql.module';
import supertokenConfig from './supertokens/config/supertoken.config';
import { SessionRequest } from 'supertokens-node/lib/build/framework/express';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './graphql/guards/auth.guard';
import { PaginationsModule } from './paginations/paginations.module';
import { ProductsModule } from './products/products.module';
import { DocIdScalar } from './db/scalars/doc-id.scalar';
import { HealthModule } from './health/health.module';
import { CategoryModule } from './categories/categoryModule';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    DbModule,
    SecurityModule,

    SupertokenModule.forRootAsync({
      inject: [supertokenConfig.KEY],
      imports: [ConfigModule.forFeature(supertokenConfig)],
      useFactory: (config: ConfigType<typeof supertokenConfig>) => {
        return {
          connectionURI: config.connectionURI,
          appInfo: {
            appName: config.appInfo.appName,
            apiDomain: config.appInfo.apiDomain,
            websiteDomain: config.appInfo.websiteDomain,
            apiBasePath: config.appInfo.apiBasePath,
            websiteBasePath: config.appInfo.websiteBasePath,
          },
        };
      },
    }),
    AuthModule,
    GraphqlModule,
    PaginationsModule,
    ProductsModule,
    HealthModule,
    CategoryModule,
    CartModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
