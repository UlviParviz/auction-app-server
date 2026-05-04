import db from '../config/database';
import { Auction } from '../models/Auction';
import { IAuction } from '../interfaces/IAuction';

export class AuctionRepository {
  public async createAuction(title: string, description: string, startingPrice: number, endTime: string, ownerId: number): Promise<Auction> {
    const query = `
      INSERT INTO auctions 
        (title, description, starting_price, current_price, end_time, owner_id, status)
      VALUES 
        ($1, $2, $3, $3, $4, $5, 'ACTIVE') 
      RETURNING *
    `;
    
    const values = [title, description, startingPrice, endTime, ownerId];
    
    const result = await db.query(query, values);
    return new Auction(result.rows[0] as IAuction);
  }

  public async findByUserId(userId: number): Promise<Auction[]> {
    const query = `
      SELECT * FROM auctions 
      WHERE owner_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  public async findBidsByUserId(userId: number): Promise<any[]> {

    const query = `
      SELECT 
        b.id AS bid_id,
        b.amount AS bid_amount,
        b.created_at AS bid_time,
        a.id AS auction_id,
        a.title AS auction_title,
        a.current_price AS current_auction_price,
        a.status AS auction_status
      FROM bids b
      JOIN auctions a ON b.auction_id = a.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  }

  public async findById(id: number): Promise<Auction | null> {
    const result = await db.query('SELECT * FROM auctions WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return new Auction(result.rows[0] as IAuction);
  }

public async placeBidWithTransaction(auctionId: number, userId: number, newPrice: number): Promise<Auction> {
  const client = await db.getClient(); 
  
  try {
    await client.query('BEGIN'); 

    await client.query(
      'INSERT INTO bids (auction_id, user_id, amount) VALUES ($1, $2, $3)',
      [auctionId, userId, newPrice]
    );

    const result = await client.query(
      'UPDATE auctions SET current_price = $1, highest_bidder_id = $2 WHERE id = $3 RETURNING *',
      [newPrice, userId, auctionId]
    );

    await client.query('COMMIT'); 
    return new Auction(result.rows[0] as IAuction);
  } catch (error) {
    await client.query('ROLLBACK'); 
    throw error;
  } finally {
    client.release();
  }
}

public async getAuctionWithBids(id: number) {
  const auctionRes = await db.query('SELECT * FROM auctions WHERE id = $1', [id]);
  if (auctionRes.rows.length === 0) return null;
  const auction = auctionRes.rows[0];

  const bidsRes = await db.query(`
    SELECT b.id, b.amount, b.created_at, u.first_name, u.last_name
    FROM bids b
    JOIN users u ON b.user_id = u.id
    WHERE b.auction_id = $1
    ORDER BY b.amount DESC
  `, [id]);

  return { 
    ...auction, 
    highest_bidder_id: auction.highest_bidder_id, 
    bids: bidsRes.rows 
  };
}

  public async findNewlyEndedAuctions(): Promise<any[]> {
    const query = `
      SELECT * FROM auctions 
      WHERE end_time <= NOW() AND status = 'ACTIVE'
    `;
    const result = await db.query(query);
    return result.rows;
  }

  public async closeAuction(auctionId: number): Promise<void> {
    const query = `
      UPDATE auctions 
      SET status = 'CLOSED' 
      WHERE id = $1
    `;
    await db.query(query, [auctionId]);
  }
}