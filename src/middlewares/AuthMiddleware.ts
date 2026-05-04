import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { AsyncWrapper } from '../utils/CatchAsync';

export interface AuthRequest extends Request {
  user?: { id: number };
}

export class AuthMiddleware {
  
  public protect = AsyncWrapper.catch(async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('İcazə yoxdur. Zəhmət olmasa sistemə daxil olun.', 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
      
      req.user = decoded; 
      
      next(); 
      
    } catch (error) {
      return next(new AppError('Sizin tokeniniz keçərsizdir və ya müddəti bitib. Yenidən daxil olun.', 401));
    }
  });


}

export const authMiddleware = new AuthMiddleware();