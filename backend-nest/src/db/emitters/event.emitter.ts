import { Injectable } from '@nestjs/common';
import { Schema } from 'mongoose';
import { Event } from '../../events/types/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emitEvents(schema: Schema, event: Partial<Event>): Schema {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    schema.post(['save', 'findOneAndReplace'], function (doc, next) {
      self.emitEvent(event.postCreated, doc);

      next();
    });

    schema.post(['updateOne', 'findOneAndUpdate'], function (doc, next) {
      self.emitEvent(event.postUpdated, doc);

      next();
    });

    return schema;
  }

  emitEvent(eventName: string | undefined, payload: unknown) {
    if (eventName) {
      this.eventEmitter.emit(eventName, payload);
    }
  }
}
