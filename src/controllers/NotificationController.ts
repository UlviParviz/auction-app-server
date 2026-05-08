import { Response } from 'express';
import { NotificationService } from '../services/NotificationService';
import { AsyncWrapper } from '../utils/CatchAsync';
import { AppError } from '../utils/AppError';
import { AuthRequest } from '../interfaces/IAuth';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public getMyNotifications = AsyncWrapper.catch(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('İcazəniz yoxdur', 401);

    const notifications = await this.notificationService.getMyUnreadNotifications(userId);
    
    res.status(200).json({ 
      success: true, 
      count: notifications.length,
      data: notifications 
    });
  });

  public markAsRead = AsyncWrapper.catch(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    const notificationId = parseInt(req.params.id as string, 10);
    
    if (!userId) throw new AppError('İcazəniz yoxdur', 401);

    await this.notificationService.markAsRead(notificationId, userId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Bildiriş oxundu olaraq işarələndi' 
    });
  });

  public markAllAsRead = AsyncWrapper.catch(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('İcazəniz yoxdur', 401);

    await this.notificationService.markAllAsRead(userId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Bütün oxunmamış bildirişlər oxundu' 
    });
  });
}

export const notificationController = new NotificationController();