import { Injectable, Scope } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import DataLoader from 'dataloader';

@Injectable({ scope: Scope.REQUEST })
export class DataLoaderFactory {
  constructor() {}

  createLoader<T>(
    repository: Repository<T>,
    relation: string,
  ): DataLoader<number, T[]> {
    return new DataLoader<number, T[]>((keys) =>
      this.batchLoadFn(keys, repository, relation),
    );
  }

  private async batchLoadFn<T>(
    ids: readonly number[],
    repository: Repository<T>,
    relation: string,
  ): Promise<T[][]> {
    const entitiesWithRelations = await repository.find({
      select: ['id'],
      where: {
        id: In(ids as number[]),
      },
    });

    return entitiesWithRelations.map((entity) => (entity as any)[relation]);
  }
}
