import {z} from 'zod';

export const updateProfilSchema = z.object({
  name: z
    .string({required_error: 'Nama tidak boleh kosong'})
    .min(2, {message: 'Nama terlalu pendek'})
    .max(50, {message: 'Nama terlalu panjang'}),
  email: z
    .string({required_error: 'Email tidak boleh kosong'})
    .email({message: 'Email tidak valid'}),
  nik: z
    .string({required_error: 'NIK tidak boleh kosong'})
    .min(4, {message: 'NIK terlalu pendek'})
    .max(255, {message: 'NIK terlalu panjang'}),
});

export const updatePasswordSchema = z
  .object({
    password: z
      .string({required_error: 'Password tidak boleh kosong'})
      .min(4, {message: 'Password terlalu pendek'})
      .max(50, {message: 'Password terlalu panjang'}),
    confirm_password: z
      .string({required_error: 'Konfirmasi password tidak boleh kosong'})
      .min(4, {message: 'Konfirmasi password terlalu pendek'})
      .max(50, {message: 'Konfirmasi password terlalu panjang'}),
  })
  .refine(data => data.password === data.confirm_password, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirm_password'],
  });

export type UpdateProfilSchema = z.infer<typeof updateProfilSchema>;
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
