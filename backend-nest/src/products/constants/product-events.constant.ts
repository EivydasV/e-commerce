import { Event } from '../../events/types/event.type';

export const productEventsConstant: Event = {
  preCreated: 'product.preCreated',
  postCreated: 'product.postCreated',
  preUpdated: 'product.preUpdated',
  postUpdated: 'product.postUpdated',
  preDeleted: 'product.preDeleted',
  postDeleted: 'product.postDeleted',
};
