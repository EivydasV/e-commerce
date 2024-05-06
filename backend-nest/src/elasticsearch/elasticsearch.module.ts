import { Global, Module } from '@nestjs/common';
import { QueryBuilder } from './builders/query.builder';
import { ElasticSearchToGraphqlTransformer } from 'src/elasticsearch/transformers/graphql-transformer';
import { DataTypeParser } from 'src/elasticsearch/parsers/data-type.parser';

@Global()
@Module({
  providers: [QueryBuilder, ElasticSearchToGraphqlTransformer, DataTypeParser],
  exports: [QueryBuilder, ElasticSearchToGraphqlTransformer],
})
export class ElasticsearchModule {}
