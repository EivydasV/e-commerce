import { z } from 'zod';
import { Types } from 'mongoose';

export const productIndexValidation = z.object({
  title: z.string(),
  _id: z.instanceof(Types.ObjectId),
  description: z.string(),
  categories: z.array(
    z.object({
      name: z.string(),
      // parent: z.nullable(z.string()),
    }),
  ),
  manufacturer: z.string(),
  isPublished: z.boolean(),
  variants: z.array(
    z.object({
      pricing: z.object({
        cost: z.number(),
        currency: z.string(),
        salePrice: z.number(),
      }),
      quantity: z.number(),
      color: z.string(),
    }),
  ),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ProductIndex = z.infer<typeof productIndexValidation>;
