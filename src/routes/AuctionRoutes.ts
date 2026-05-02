import { Router } from 'express';
import { AuctionController } from '../controllers/AuctionController';
import { AuctionService } from '../services/AuctionService';

const router = Router();

const auctionService = new AuctionService();
const auctionController = new AuctionController(auctionService);

router.get('/:id', auctionController.getAuctionById);

router.post('/:id/bid', auctionController.placeBid);

export default router;