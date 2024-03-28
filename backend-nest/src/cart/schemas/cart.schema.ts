import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { TimestampsSchema } from '../../db/schema/timestamps.schema';
import { DocId } from '../../db/types/doc-id.type';
import { Product } from '../../products/schemas/product.schema';
import { ProductVariant } from '../../products/schemas/product-variant.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
  timestamps: true,
})
@ObjectType()
export class Cart extends TimestampsSchema {
  @Field(() => Product)
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  product: DocId;

  @Field(() => ProductVariant)
  @Prop({ required: true, type: Types.ObjectId, ref: 'ProductVariant' })
  productVariant: DocId;

  @Prop({ required: true })
  quantity: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
