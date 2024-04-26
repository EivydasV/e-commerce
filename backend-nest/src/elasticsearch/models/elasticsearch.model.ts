import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { ElasticsearchModelInterface } from '../interfaces/elasticsearch-model.interface';

export function ElasticsearchModel<T>(
  classRef: Type<T>,
): Type<ElasticsearchModelInterface<T>> {
  @ObjectType()
  class ElasticsearchModel<T> {
    count: number;
    maxScore: number;

    @Field(() => [Hits])
    hits: Hits<T>[];
  }

  @ObjectType()
  class Hits<T> {
    _index: string;
    _id: string;
    _score: number;

    @Field(() => classRef)
    _source: T;
  }

  return ElasticsearchModel;
}
