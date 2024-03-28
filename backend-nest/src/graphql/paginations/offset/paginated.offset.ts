import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OffsetPaginatedType } from '../../../db/types/offset-paginated.type';

export function OffsetPaginated<T>(
  classRef: Type<T>,
): Type<OffsetPaginatedType<T>> {
  @ObjectType(`offset${classRef.name}Edge`)
  class OffsetEdgeType {
    @Field(() => classRef)
    node!: T;
  }

  @ObjectType({ isAbstract: true })
  class OffsetPaginated implements OffsetPaginatedType<T> {
    @Field(() => [OffsetEdgeType])
    edges: OffsetEdgeType[];

    @Field()
    totalDocs: number;

    @Field()
    currentPage: number;

    @Field()
    hasNextPage: boolean;

    @Field()
    hasPreviousPage: boolean;

    @Field(() => Int, { nullable: true })
    nextPage: number | null;

    @Field(() => Int, { nullable: true })
    previousPage: number | null;

    @Field()
    totalPages: number;
  }

  return OffsetPaginated as Type<OffsetPaginatedType<T>>;
}
