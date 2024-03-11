import { Type } from '@nestjs/common';
import { PaginatedType } from '../../../paginations/offset/types/paginated.type';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export function OffsetPaginated<T>(classRef: Type<T>): Type<PaginatedType<T>> {
  @ObjectType(`offset${classRef.name}Edge`)
  abstract class OffsetEdgeType {
    @Field(() => classRef)
    node!: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class OffsetPaginatedType implements PaginatedType<T> {
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

  return OffsetPaginatedType as Type<PaginatedType<T>>;
}
