import { BaseRepositoryType } from '../types/base-repository.type';
import {
  FilterQuery,
  HydratedDocument,
  Model,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { OmitBaseType } from '../types/omit-base.type';
import { Injectable } from '@nestjs/common';
import { MongooseQuery } from '../types/query.type';
import { DocId } from '../types/doc-id.type';

@Injectable()
export class BaseRepository<Entity> implements BaseRepositoryType<Entity> {
  constructor(private readonly entity: Model<Entity>) {}

  async create(payload: OmitBaseType<Entity>): Promise<Entity> {
    return this.entity.create(payload);
  }

  findById(DocId: DocId): MongooseQuery<HydratedDocument<Entity>> | null {
    return this.entity.findById(DocId);
  }
  findByIdAndUpdate(
    id: DocId,
    update: UpdateQuery<Entity>,
    options?: QueryOptions<Entity> | null | undefined,
  ): MongooseQuery<HydratedDocument<Entity>> | null {
    return this.entity.findByIdAndUpdate(id, update, options);
  }
  findByIdAndDelete(id: DocId): MongooseQuery<HydratedDocument<Entity>> | null {
    return this.entity.findByIdAndDelete(id);
  }
  findAll(
    filter?: FilterQuery<HydratedDocument<Entity>>,
  ): MongooseQuery<HydratedDocument<Entity>[]> {
    return this.entity.find(filter || {}, {}, {});
  }
  findOne(
    filter: FilterQuery<Entity> | undefined,
  ): MongooseQuery<HydratedDocument<Entity>> | null {
    return this.entity.findOne(filter);
  }
}
