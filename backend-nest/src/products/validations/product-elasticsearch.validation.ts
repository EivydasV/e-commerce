import { z } from 'zod';
import { baseSchema } from '../../elasticsearch/validations/baseSchema';

export const productIndexSchema = z
  .object({
    _id: z.string(),
    title: z.string(),
    description: z.string(),
    categories: z.array(
      z.object({
        name: z.string(),
      }),
    ),
    manufacturer: z.string(),
    isPublished: z.optional(z.boolean()),
    variants: z.optional(
      z.array(
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
    ),
    createdAt: z.optional(z.date()),
    updatedAt: z.optional(z.date()),
  })
  .merge(baseSchema)
  .transform(({ _id, ...rest }) => ({ id: _id.toString(), ...rest }));

export type ProductIndexInput = z.input<typeof productIndexSchema>;
