import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { TimestampsSchema } from '../../db/schema/timestamps.schema';
import { DocId } from '../../db/types/doc-id.type';

export type CategoryDocument = HydratedDocument<Category>;
@Schema({
  timestamps: true,
})
@ObjectType()
export class Category extends TimestampsSchema {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, default: null })
  @Field(() => Category, { nullable: true })
  parent?: DocId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
