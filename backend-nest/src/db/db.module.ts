import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigType } from '@nestjs/config';
import dbConfig from './configs/db.config';
import { EventEmitter } from './emitters/event.emitter';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      inject: [dbConfig.KEY],
      useFactory: (config: ConfigType<typeof dbConfig>) => {
        return {
          uri: config.databaseURL,
        };
      },
    }),
  ],
  providers: [EventEmitter],
  exports: [EventEmitter],
})
export class DbModule {}
