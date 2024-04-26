import { documentLimitConstant } from '../constants/document-limit.constant';

export class PageLimitReachedError extends Error {
  constructor() {
    super(`page limit reached of ${documentLimitConstant}`);
    this.name = this.constructor.name;
  }
}
