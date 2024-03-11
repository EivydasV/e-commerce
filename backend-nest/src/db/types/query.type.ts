import { QueryWithHelpers } from 'mongoose';

export type MongooseQuery<T> = QueryWithHelpers<
  T,
  any,
  NonNullable<unknown>,
  any,
  any
> &
  NonNullable<unknown>;
