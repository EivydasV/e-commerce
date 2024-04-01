import { Field, ObjectType } from '@nestjs/graphql';
import { DocId } from '../types/doc-id.type';
import { DocIdScalar as DocIdScalar } from '../scalars/doc-id.scalar';

@ObjectType()
export class IdentifiableSchema {
  @Field(() => DocIdScalar)
  _id: DocId;
}
