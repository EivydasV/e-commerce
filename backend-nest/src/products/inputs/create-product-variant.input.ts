import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
class ProductDimensionsInput {
  @IsInt()
  @IsNotEmpty()
  weight: number;

  @IsInt()
  @IsNotEmpty()
  width: number;

  @IsInt()
  @IsNotEmpty()
  height: number;

  @IsInt()
  @IsNotEmpty()
  depth: number;
}

@InputType()
class PricingInput {
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Field(() => Float)
  cost: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Field(() => Float)
  salePrice: number;
}

@InputType()
export class CreateProductVariantInput {
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  color: string;

  // @IsNotEmpty()
  // images: string[];

  @ValidateNested()
  @Type(() => ProductDimensionsInput)
  @Field(() => ProductDimensionsInput)
  productDimensions: ProductDimensionsInput;

  @ValidateNested()
  @Type(() => PricingInput)
  @Field(() => PricingInput)
  pricing: PricingInput;

  // @IsNotEmpty()
  // sku: string;
}
