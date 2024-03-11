import { EdgeType } from './edge.type';

export interface PaginatedType<T> {
  edges: EdgeType<T>[];

  totalDocs: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;

  nextPage: number | null;

  previousPage: number | null;

  currentPage: number;

  totalPages: number;
}
