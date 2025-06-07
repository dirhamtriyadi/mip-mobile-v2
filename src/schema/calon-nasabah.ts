import {z} from 'zod';

const imageFileSchema = z
  .object(
    {
      uri: z.string(),
      type: z.string(),
      fileName: z.string(),
      fileSize: z.number(),
    },
    {
      message:
        'File harus berupa objek dengan uri, type, fileName, dan fileSize',
      required_error: 'File harus diisi',
    },
  )
  .refine(
    file => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
    {message: 'File harus berformat JPG, PNG, atau JPEG'},
  )
  .refine(file => file.fileSize <= 2 * 1024 * 1024, {
    message: 'Ukuran file maksimal 2MB',
  });

const requiredImageFileSchema = imageFileSchema.refine(
  file => file.uri && file.uri.length > 0,
  {message: 'File harus diisi'},
);

export const calonNasabahCreateSchema = z.object({
  name: z.string().min(1, 'Nama lengkap wajib diisi'),
  no_ktp: z.string({required_error: 'Nomor KTP wajib diisi'}),
  ktp: requiredImageFileSchema,
  kk: requiredImageFileSchema,
  status: z.enum(['pending', 'approved', 'rejected']).nullish(),
  status_message: z.string().nullish(),
  user_id: z.number().nullish(),
  bank_id: z.number({required_error: 'Bank wajib dipilih'}),
});

export type CalonNasabahCreateSchema = z.infer<typeof calonNasabahCreateSchema>;
