import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { AppError } from '../utils/AppError';
import { AsyncWrapper } from '../utils/CatchAsync';
import { AuthRequest } from '../interfaces/IAuth';

export class AuthController {
  private authService = new AuthService();

  public register = AsyncWrapper.catch(async (req: Request, res: Response) => {
    const { first_name, last_name, email, password } = req.body;

    const data = await this.authService.register(first_name, last_name, email, password);

    res.status(201).json({ success: true, data });
  });

  public login = AsyncWrapper.catch(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const data = await this.authService.login(email, password);

    res.status(200).json({ success: true, data });
  });

  public updatePassword = AsyncWrapper.catch(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      throw new AppError('İstifadəçi id-si tapılmadı. Zəhmət olmasa yenidən daxil olun.', 401);
    }

    if (!oldPassword || !newPassword) {
      throw new AppError('Zəhmət olmasa köhnə və yeni şifrəni daxil edin.', 400);
    }

    if (newPassword.length < 6) {
      throw new AppError('Yeni şifrə ən azı 6 simvoldan ibarət olmalıdır.', 400);
    }

    await this.authService.updatePassword(userId, oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Şifrəniz uğurla yeniləndi.'
    });
  });

  public getMe = AsyncWrapper.catch(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('İcazə yoxdur. Zəhmət olmasa daxil olun.', 401);
    }

    const user = await this.authService.getMe(userId);
    res.status(200).json({ success: true, data: user });
  });
}

export const authController = new AuthController();