import db from '../config/database'; 
import { Auction } from '../models/Auction';
import { IAuction } from '../interfaces/IAuction';

export class AuctionRepository {
  public async findById(id: number): Promise<Auction | null> {
    const result = await db.query('SELECT * FROM auctions WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return new Auction(result.rows[0] as IAuction);
  }

  public async updatePrice(id: number, newPrice: number): Promise<Auction> {
    const result = await db.query(
      'UPDATE auctions SET current_price = $1 WHERE id = $2 RETURNING *',
      [newPrice, id]
    );
    return new Auction(result.rows[0] as IAuction);
  }
}