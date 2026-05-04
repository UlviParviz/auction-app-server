import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthRequest } from '../middlewares/AuthMiddleware';

export class AuthController {
  private authService = new AuthService();

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { first_name, last_name, email, password } = req.body;
      const data = await this.authService.register(first_name, last_name, email, password);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const data = await this.authService.login(email, password);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  public getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) throw new Error('İcazə yoxdur');
      
      const user = await this.authService.getMe(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }
}