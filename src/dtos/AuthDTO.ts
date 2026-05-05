import { z } from 'zod';

export class AuthDTO {
  public static readonly RegisterSchema = z.object({
    body: z.object({
      first_name: z.string().min(2, 'Ad minimum 2 simvol olmalıdır'),
      last_name: z.string().min(2, 'Soyad minimum 2 simvol olmalıdır'),
      email: z.string().email('Düzgün email formatı daxil edin'),
      password: z.string().min(6, 'Parol minimum 6 simvol olmalıdır'),
    }),
  });

  public static readonly LoginSchema = z.object({
    body: z.object({
      email: z.string().email('Düzgün email formatı daxil edin'),
      password: z.string().min(1, 'Parol daxil edilməlidir'),
    }),
  });

  public static readonly UpdatePasswordSchema = z.object({
    body: z.object({
      oldPassword: z.string().min(1, { message: 'Köhnə şifrə tələb olunur' }),
      newPassword: z.string().min(6, { message: 'Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır' }),
    }),
  });
}

export namespace AuthTypes {
  export type Register = z.infer<typeof AuthDTO.RegisterSchema>['body'];
  export type Login = z.infer<typeof AuthDTO.LoginSchema>['body'];
  export type UpdatePassword = z.infer<typeof AuthDTO.UpdatePasswordSchema>['body'];
}