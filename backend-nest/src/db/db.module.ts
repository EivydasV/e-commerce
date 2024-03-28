import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigType } from '@nestjs/config';
import dbConfig from './configs/db.config';
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
})
export class DbModule {}
