import { Global, Module } from '@nestjs/common';
import { QueryBuilder } from './builders/query.builder';

@Global()
@Module({
  providers: [QueryBuilder],
  exports: [QueryBuilder],
})
export class ElasticsearchModule {}
