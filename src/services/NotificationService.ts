import { NotificationRepository } from '../repositories/NotificationRepository';
import { SocketManager } from '../sockets/SocketManager';
import { INotification } from '../interfaces/INotification';

export class NotificationService {
  private notificationRepo: NotificationRepository;

  constructor() {
    this.notificationRepo = new NotificationRepository();
  }

  public async createNotification(userId: number, type: string, message: string, auctionId?: number): Promise<INotification> {
    const notification = await this.notificationRepo.create(userId, type, message, auctionId);
    
    const io = SocketManager.getInstance().io;
    io.to(`user_${userId}`).emit('notification', notification);
    
    return notification;
  }

  public async getMyUnreadNotifications(userId: number): Promise<INotification[]> {
    return await this.notificationRepo.findUnreadByUserId(userId);
  }

  public async markAsRead(notificationId: number, userId: number): Promise<void> {
    await this.notificationRepo.markAsRead(notificationId, userId);
  }

  public async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepo.markAllAsRead(userId);
  }
}