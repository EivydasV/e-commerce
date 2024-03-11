import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SupertokenMiddleware } from './middlewares/supertoken.middleware';
import { SupertokenService } from './supertoken.service';
import { ConfigurableModuleClass } from './supertoken.module-definition';
import { ConfigModule } from '@nestjs/config';
import supertokenConfig from './config/supertoken.config';

@Module({
  imports: [ConfigModule.forFeature(supertokenConfig)],
  providers: [SupertokenService],
  exports: [],
  controllers: [],
})
export class SupertokenModule
  extends ConfigurableModuleClass
  implements NestModule
{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SupertokenMiddleware).forRoutes('*');
  }
}
