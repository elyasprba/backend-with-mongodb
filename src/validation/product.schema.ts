import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(4, 'Name must be more than 4 letter'),
  price: z.string(),
  stock: z.string(),
  description: z.string().min(4, 'Description must be more than 4 letter'),
  user_id: z.string(),
});
