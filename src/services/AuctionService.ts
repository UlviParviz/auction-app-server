import { AuctionRepository } from '../repositories/AuctionRepository';
import { SocketManager } from '../sockets/SocketManager';
import { Auction } from '../models/Auction';
import { AppError } from '../utils/AppError';
import redis from '../config/redis';
import { AuctionTypes } from '../dtos/AuctionDTO';
import { IAuctionWithOwner, IBidWithAuction, IAuctionWithBids } from '../interfaces/IAuction';

export class AuctionService {
  private auctionRepo: AuctionRepository;

  constructor() {
    this.auctionRepo = new AuctionRepository();
  }

  public async getAllAuctions(): Promise<IAuctionWithOwner[]> {
    return await this.auctionRepo.getAllAuctions();
  }

  public async getMyAuctions(userId: number): Promise<Auction[]> {
    return await this.auctionRepo.findByUserId(userId);
  }

  public async getMyBids(userId: number): Promise<Auction[]> {
    return await this.auctionRepo.findBidsByUserId(userId);
  }

  public async createAuction(data: AuctionTypes.CreateAuction, ownerId: number): Promise<Auction> {
    const newAuction = await this.auctionRepo.createAuction(
      data.title,
      data.description,
      data.starting_price,
      data.end_time,
      ownerId
    );

    return newAuction;
  }

  public async placeBid(auctionId: number, userId: number, bidAmount: number): Promise<Auction> {
    const auction = await this.auctionRepo.findById(auctionId);

    if (!auction) throw new AppError('Hərrac tapılmadı', 404);

    const isExpired = new Date(auction.end_time) <= new Date();
    if (auction.status !== 'ACTIVE' || isExpired) {
      throw new AppError('Bu hərrac artıq başa çatıb və ya bağlanıb', 400);
    }

    if (auction.owner_id === userId) {
      throw new AppError('Öz hərracınıza təklif verə bilməzsiniz', 400);
    }

    if (bidAmount <= auction.current_price) {
      throw new AppError('Təklif mövcud qiymətdən yüksək olmalıdır', 400);
    }

    const previousHighestBidderId = auction.highest_bidder_id;
    const auctionOwnerId = auction.owner_id;

    const updatedAuction = await this.auctionRepo.placeBidWithTransaction(auctionId, userId, bidAmount);

    await redis.del(`auction_with_bids:${auctionId}`);

    const io = SocketManager.getInstance().io;

    io.to(`auction_${auctionId}`).emit('bidUpdated', updatedAuction);

    if (previousHighestBidderId && previousHighestBidderId !== userId) {
      io.to(`user_${previousHighestBidderId}`).emit('notification', {
        type: 'OUTBID',
        message: `Təklifiniz keçildi! Hərrac #${auctionId} üçün yeni qiymət: ${bidAmount}`,
        auctionId: auctionId
      });
    }

    if (auctionOwnerId !== userId) {
      io.to(`user_${auctionOwnerId}`).emit('notification', {
        type: 'NEW_BID',
        message: `Hərracınıza yeni təklif gəldi: ${bidAmount}`,
        auctionId: auctionId
      });
    }

    return updatedAuction;
  }

  public async getAuction(id: number): Promise<IAuctionWithBids> {
    const cacheKey = `auction_with_bids:${id}`;

    try {
      const cachedString = await redis.get(cacheKey);
      if (cachedString) return JSON.parse(cachedString) as IAuctionWithBids;
    } catch (err) {
      console.warn('Redis oxuma xətası, birbaşa bazadan oxunur...', err);
    }

    const auction = await this.auctionRepo.getAuctionWithBids(id);
    if (!auction) throw new AppError('Hərrac tapılmadı', 404);

    try {
      await redis.set(cacheKey, JSON.stringify(auction), 60);
    } catch (err) {
      console.warn('Redis yazma xətası...', err);
    }

    return auction;
  }

  public async deleteMyAuction(auctionId: number, userId: number): Promise<void> {
    const auction = await this.auctionRepo.findById(auctionId);
    if (!auction) throw new AppError('Hərrac tapılmadı', 404);

    if (auction.owner_id !== userId) {
      throw new AppError('Yalnız öz yaratdığınız hərracı silə bilərsiniz', 403);
    }

    if (auction.highest_bidder_id) {
      throw new AppError('Bu hərraca artıq təklif verildiyi üçün onu silmək mümkün deyil', 400);
    }

    await this.auctionRepo.deleteAuction(auctionId);
    
    await redis.del(`auction_with_bids:${auctionId}`);
  }

  public async processEndedAuctions(): Promise<void> {
    const endedAuctions = await this.auctionRepo.findNewlyEndedAuctions();

    for (const auction of endedAuctions) {
      await this.auctionRepo.closeAuction(auction.id);

      await redis.del(`auction_with_bids:${auction.id}`);

      const io = SocketManager.getInstance().io;

      io.to(`auction_${auction.id}`).emit('auctionEnded', {
        auctionId: auction.id,
        winnerId: auction.highest_bidder_id,
        finalPrice: auction.current_price,
        message: 'Hərrac bitdi!'
      });

      if (auction.highest_bidder_id) {
        io.to(`user_${auction.highest_bidder_id}`).emit('notification', {
          type: 'AUCTION_WON',
          message: `Təbrik edirik! Siz #${auction.id} nömrəli hərracın qalibi oldunuz!`,
          auctionId: auction.id
        });
      }

      io.to(`user_${auction.owner_id}`).emit('notification', {
        type: 'AUCTION_CLOSED',
        message: `Sizin #${auction.id} nömrəli hərracınız bitdi. Yekun qiymət: ${auction.current_price}`,
        auctionId: auction.id
      });
    }
  }
}