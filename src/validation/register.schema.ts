import { z } from 'zod';

export const userRegistrationSchema = z.object({
  username: z.string().min(4, 'Username must be more than 4 letter'),
  email: z.string().email('Email must be valid'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
});
