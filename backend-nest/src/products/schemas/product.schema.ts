import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { TimestampsSchema } from '../../db/schema/timestamps.schema';
import { OffsetPaginated } from '../../graphql/paginations/offset/paginated.offset';
import { User } from '../../users/schemas/user.schema';
import { ProductVariant } from './product-variant.schema';
import { DocId } from '../../db/types/doc-id.type';
import { Category } from '../../categories/schemas/category.schema';
import { SchemaName } from '../../db/types/schema-name.type';

export type ProductDocument = HydratedDocument<Product>;

export const ProductEntityName = 'Product';
@Schema({
  timestamps: true,
  collection: ProductEntityName,
})
@ObjectType()
export class Product extends TimestampsSchema implements SchemaName {
  @Prop({ required: true, maxlength: 255, immutable: true })
  entityName: string;

  @Prop({ required: true, maxlength: 255, unique: true })
  title: string;

  @Prop({ required: true, maxlength: 255, unique: true })
  slug: string;

  @Prop({ required: true, maxlength: 3000 })
  description: string;

  @Prop({ required: true, maxlength: 255 })
  manufacturer: string;

  @Prop()
  thumbnail?: string;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop([{ type: ProductVariant, maxlength: 5 }])
  @Field(() => [ProductVariant])
  variants?: Types.DocumentArray<ProductVariant>;

  @Field(() => User)
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  seller: DocId;

  @Field(() => [Category])
  @Prop([{ type: Types.ObjectId, ref: 'Category', minlength: 1, maxlength: 5 }])
  categories: DocId[];
}

@ObjectType()
export class OffsetPaginatedProduct extends OffsetPaginated(Product) {}

export const ProductSchema = SchemaFactory.createForClass(Product);
