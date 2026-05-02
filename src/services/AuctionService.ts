import { AuctionRepository } from '../repositories/AuctionRepository';
import { SocketManager } from '../sockets/SocketManager';
import { Auction } from '../models/Auction';
import redis from '../config/redis'; // <--- BU SƏTİR ƏLAVƏ EDİLMƏLİDİR

export class AuctionService {
  private auctionRepo: AuctionRepository;

  constructor() {
    this.auctionRepo = new AuctionRepository();
  }

  public async placeBid(auctionId: number, bidAmount: number): Promise<Auction> {
    const auction = await this.auctionRepo.findById(auctionId);
    
    if (!auction) throw new Error('Hərrac tapılmadı');
    if (bidAmount <= auction.current_price) {
      throw new Error('Təklif mövcud qiymətdən yüksək olmalıdır');
    }

    const updatedAuction = await this.auctionRepo.updatePrice(auctionId, bidAmount);
    
    // Redis artıq tanınacaq
    await redis.set(`auction:${auctionId}`, updatedAuction, 300);
    
    SocketManager.getInstance().io
      .to(`auction_${auctionId}`)
      .emit('bidUpdated', updatedAuction);
    
    return updatedAuction;
  }
  public async getAuction(id: number): Promise<Auction> {
    const cacheKey = `auction:${id}`;
    
    // 1. Öncə məlumatın Redis-də (Cache) olub-olmadığını yoxlayırıq
    const cachedAuction = await redis.get(cacheKey);
    if (cachedAuction) {
      console.log('Məlumat Redis-dən gəldi');
      return cachedAuction;
    }

    // 2. Əgər Redis-də yoxdursa, PostgreSQL-dən (Bazadan) götürürük
    const auction = await this.auctionRepo.findById(id);
    if (!auction) throw new Error('Hərrac tapılmadı');

    // 3. Növbəti sorğular sürətli olsun deyə nəticəni Redis-ə yazırıq (300 saniyəlik)
    await redis.set(cacheKey, auction, 300);
    console.log('Məlumat Postgres-dən gəldi və Redis-ə yazıldı');
    
    return auction;
  }
}