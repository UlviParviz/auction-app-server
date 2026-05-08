import db from '../config/database';
import { INotification } from '../interfaces/INotification';

export class NotificationRepository {
  
  public async create(userId: number, type: string, message: string, auctionId?: number): Promise<INotification> {
    const query = `
      INSERT INTO notifications (user_id, type, message, auction_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const result = await db.query(query, [userId, type, message, auctionId || null]);
    return result.rows[0] as INotification;
  }

  public async findUnreadByUserId(userId: number): Promise<INotification[]> {
    const query = `
      SELECT * FROM notifications 
      WHERE user_id = $1 AND is_read = FALSE 
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows as INotification[];
  }

  public async markAsRead(id: number, userId: number): Promise<void> {
    const query = `
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE id = $1 AND user_id = $2
    `;
    await db.query(query, [id, userId]);
  }

  public async markAllAsRead(userId: number): Promise<void> {
    const query = `
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE user_id = $1 AND is_read = FALSE
    `;
    await db.query(query, [userId]);
  }
}