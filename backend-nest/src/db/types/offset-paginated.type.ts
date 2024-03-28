import { OffsetEdgeType } from './offset-edge.type';

export interface OffsetPaginatedType<T> {
  edges: OffsetEdgeType<T>[];

  totalDocs: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;

  nextPage: number | null;

  previousPage: number | null;

  currentPage: number;

  totalPages: number;
}
