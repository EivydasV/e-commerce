import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { SecurityModule } from './security/security.module';
import { AuthModule } from './auth/auth.module';
import { SupertokenModule } from './supertokens/supertoken.module';
import { GraphqlModule } from './graphql/graphql.module';
import supertokenConfig from './supertokens/config/supertoken.config';
import { ProductsModule } from './products/products.module';
import { HealthModule } from './health/health.module';
import { CategoryModule } from './categories/categoryModule';
import { CartModule } from './cart/cart.module';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { EventsModule } from './events/events.module';
import { CoreModule } from './core/core.module';
import { CaslModule } from './casl/casl.module';
import { RoleModule } from './role/role.module';

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
    ProductsModule,
    HealthModule,
    CategoryModule,
    CartModule,
    ElasticsearchModule,
    EventsModule,
    CoreModule,
    CaslModule,
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
