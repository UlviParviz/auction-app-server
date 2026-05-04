import db from '../config/database';
import { AppError } from '../utils/AppError';
import redis from '../config/redis';

export class AdminService {
  public async getAllUsers() {
    const query = `
      SELECT id, first_name, last_name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  public async deleteUser(id: number) {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rowCount === 0) {
      throw new AppError('İstifadəçi tapılmadı', 404);
    }
    return true;
  }

  public async deleteAuction(id: number) {
    const result = await db.query('DELETE FROM auctions WHERE id = $1 RETURNING id', [id]);
    
    if (result.rowCount === 0) {
      throw new AppError('Hərrac tapılmadı', 404);
    }

    await redis.del(`auction_with_bids:${id}`);
    
    return true;
  }
}