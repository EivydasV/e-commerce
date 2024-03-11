import { ObjectType } from '@nestjs/graphql';
import { IdentifiableSchema } from './identifiable.schema';

@ObjectType()
export class TimestampsSchema extends IdentifiableSchema {
  createdAt?: Date;
  updatedAt?: Date;
}
