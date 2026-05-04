import { Request, Response } from 'express';
import { AuctionService } from '../services/AuctionService';
import { AuthRequest } from '../middlewares/AuthMiddleware';
import { AppError } from '../utils/AppError';
import { AsyncWrapper } from '../utils/CatchAsync';

export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  public getAllAuctions = AsyncWrapper.catch(async (req: Request, res: Response) => {
    const auctions = await this.auctionService.getAllAuctions();
    
    res.status(200).json({ 
      success: true, 
      count: auctions.length, 
      data: auctions 
    });
  });

  public createAuction = AsyncWrapper.catch(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    
    if (!userId) {
      throw new AppError('İstifadəçi id-si tapılmadı', 401);
    }

    const newAuction = await this.auctionService.createAuction(req.body, userId);
    
    res.status(201).json({ 
      success: true, 
      message: 'Hərrac uğurla yaradıldı',
      data: newAuction 
    });
  });

  public getAuctionById = AsyncWrapper.catch(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const auction = await this.auctionService.getAuction(id);
    
    if (!auction) {
      throw new AppError('Hərrac tapılmadı', 404);
    }

    res.status(200).json({ success: true, data: auction });
  });

  public placeBid = AsyncWrapper.catch(async (req: AuthRequest, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    const amount = req.body.amount;
    const userId = req.user?.id; 

    if (!userId) {
      throw new AppError('İstifadəçi id-si tapılmadı', 401);
    }

    const updatedAuction = await this.auctionService.placeBid(id, userId, amount);
    
    res.status(200).json({ success: true, data: updatedAuction });
  });
  public getMyAuctions = AsyncWrapper.catch(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('İstifadəçi id-si tapılmadı', 401);

    const auctions = await this.auctionService.getMyAuctions(userId);
    res.status(200).json({ success: true, data: auctions });
  });

  public getMyBids = AsyncWrapper.catch(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('İstifadəçi id-si tapılmadı', 401);

    const bids = await this.auctionService.getMyBids(userId);
    res.status(200).json({ success: true, data: bids });
  });
}