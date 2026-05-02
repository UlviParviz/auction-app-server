import { Request, Response } from 'express';
import { AuctionService } from '../services/AuctionService';

export class AuctionController {
  constructor(private auctionService: AuctionService) {}

  // YENİ ƏLAVƏ OLUNAN FUNKSİYA
  public getAuctionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const auction = await this.auctionService.getAuction(id);
      
      res.status(200).json({ success: true, data: auction });
    } catch (error: any) {
      // Tapılmadıqda 404 xətası qaytarırıq
      res.status(404).json({ success: false, message: error.message });
    }
  }

  // ƏVVƏLKİ FUNKSİYA (Təklif vermək üçün)
  public placeBid = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { amount } = req.body;
      
      const updatedAuction = await this.auctionService.placeBid(id, amount);
      res.status(200).json({ success: true, data: updatedAuction });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}