import { z } from 'zod';

export const RegisterSchema = z.object({
  body: z.object({
    first_name: z.string().min(2, 'Ad minimum 2 simvol olmalıdır'),
    last_name: z.string().min(2, 'Soyad minimum 2 simvol olmalıdır'),
    email: z.string().email('Düzgün email formatı daxil edin'),
    password: z.string().min(6, 'Parol minimum 6 simvol olmalıdır'),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email('Düzgün email formatı daxil edin'),
    password: z.string().min(1, 'Parol daxil edilməlidir'),
  }),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>['body'];
export type LoginDTO = z.infer<typeof LoginSchema>['body'];