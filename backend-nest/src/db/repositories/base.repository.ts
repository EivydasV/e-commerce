import { BaseRepositoryType } from '../types/base-repository.type';
import {
  FilterQuery,
  HydratedDocument,
  Model,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { OmitBaseType } from '../types/omit-base.type';
import { MongooseQuery } from '../types/query.type';
import { DocId } from '../types/doc-id.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Event } from '../../events/types/event.type';

export class BaseRepository<Entity> implements BaseRepositoryType<Entity> {
  constructor(
    private readonly entity: Model<Entity>,
    private readonly event?: Event,
    private readonly eventEmitter?: EventEmitter2,
  ) {}

  async create(payload: OmitBaseType<Entity>): Promise<Entity> {
    this.emitEvent(this.event?.preCreated, payload);
    const create = await this.entity.create({
      ...payload,
      entityName: this.entity.collection.collectionName,
    });
    const res = this.emitEvent(this.event?.postCreated, create);
    console.log({ res });

    return create;
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

  estimateCount(): MongooseQuery<number> {
    return this.entity.estimatedDocumentCount();
  }

  private emitEvent(event?: string, object?: unknown): boolean | void {
    if (
      this.eventEmitter !== undefined &&
      this.event !== undefined &&
      event !== undefined
    ) {
      this.eventEmitter.emit(event, object);
    }
  }
}
