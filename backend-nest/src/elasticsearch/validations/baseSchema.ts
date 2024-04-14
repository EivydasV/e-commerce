import { z } from 'zod';
import { Types } from 'mongoose';

export const baseSchema = z.object({
  _id: z.instanceof(Types.ObjectId),
});
