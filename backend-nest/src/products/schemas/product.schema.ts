import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { TimestampsSchema } from '../../db/schema/timestamps.schema';
import { OffsetPaginated } from '../../graphql/paginations/offset/paginated.offset';
import { User } from '../../users/schemas/user.schema';
import { ProductVariant } from './product-variant.schema';
import { DocId } from '../../db/types/doc-id.type';
import { Category } from '../../categories/schemas/category.schema';

export type ProductDocument = HydratedDocument<Product>;
@Schema({
  timestamps: true,
})
@ObjectType()
export class Product extends TimestampsSchema {
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
  isPublished?: boolean;

  @Prop([{ type: ProductVariant, maxlength: 5 }])
  @Field(() => [ProductVariant])
  variants?: Types.DocumentArray<ProductVariant>;

  @Field(() => User)
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  seller: DocId;

  @Field(() => [Category])
  @Prop([
    { type: Types.ObjectId, ref: Category.name, minlength: 1, maxlength: 5 },
  ])
  categories: DocId[];
}

@ObjectType()
export class OffsetPaginatedProduct extends OffsetPaginated(Product) {}

export const ProductSchema = SchemaFactory.createForClass(Product);
