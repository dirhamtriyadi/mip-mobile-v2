import {z} from 'zod';

export const loginSchema = z.object({
  email: z
    .string({required_error: 'Email wajib diisi'})
    .email({message: 'Email tidak valid'}),
  password: z
    .string({required_error: 'Password wajib diisi'})
    .min(4, {message: 'Password minimal 4 karakter'}),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
