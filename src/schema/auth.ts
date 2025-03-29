import {z} from 'zod';

export const loginSchema = z.object({
  email: z
    .string({required_error: 'Email is required'})
    .email({message: 'Invalid email'}),
  password: z
    .string({required_error: 'Password is required'})
    .min(4, {message: 'Password must be at least 4 characters long'}),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;