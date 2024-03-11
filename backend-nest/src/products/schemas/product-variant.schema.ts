import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { TimestampsSchema } from '../../db/schema/timestamps.schema';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;

@ObjectType()
class ProductDimensions {
  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  depth: number;
}

@ObjectType()
class Pricing {
  @Prop({ required: true })
  @Field(() => Float)
  cost: number;

  @Prop({ required: true })
  currency: string;

  @Prop({
    required: true,
  })
  @Field(() => Float)
  salePrice: number;
}

@Schema({
  timestamps: true,
})
@ObjectType()
export class ProductVariant extends TimestampsSchema {
  @Prop({ required: true })
  pricing: Pricing;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  color: string;

  @Prop({})
  images?: string[];

  @Prop({ required: true })
  productDimensions: ProductDimensions;

  // @Prop({ required: true })
  // sku: string;
}

export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);
