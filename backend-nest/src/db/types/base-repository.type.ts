import {
  FilterQuery,
  HydratedDocument,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { OmitBaseType } from './omit-base.type';
import { MongooseQuery } from './query.type';
import { DocId } from './doc-id.type';

export interface BaseRepositoryType<Entity> {
  create(payload: OmitBaseType<Entity>): Promise<Entity>;
  updateOrCreate(
    filter: FilterQuery<Entity>,
    update: UpdateQuery<Entity>,
  ): MongooseQuery<HydratedDocument<Entity>>;
  findById(id: DocId): MongooseQuery<HydratedDocument<Entity>> | null;
  findByIdAndUpdate(
    id: DocId,
    data: UpdateQuery<Entity>,
    options?: QueryOptions<Entity> | null | undefined,
  ): MongooseQuery<HydratedDocument<Entity>> | null;
  findByIdAndDelete(id: DocId): MongooseQuery<HydratedDocument<Entity>> | null;
  findAll(
    filter?: FilterQuery<HydratedDocument<Entity>>,
  ): MongooseQuery<HydratedDocument<Entity>[]>;
  findOne(
    filter: FilterQuery<Entity> | undefined,
  ): MongooseQuery<HydratedDocument<Entity>> | null;
  estimateCount(): MongooseQuery<number>;
  countDocuments(filter?: FilterQuery<Entity>): MongooseQuery<number>;
}
