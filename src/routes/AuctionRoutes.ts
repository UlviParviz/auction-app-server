import { Router } from 'express';
import { AuctionController } from '../controllers/AuctionController';
import { AuctionService } from '../services/AuctionService';
import { authMiddleware } from '../middlewares/AuthMiddleware'; 
import { CreateAuctionSchema, PlaceBidSchema } from '../dtos/AuctionDTO';
import { validateMiddleware } from '../middlewares/ValidateMiddleware';

const router = Router();
const auctionService = new AuctionService();
const auctionController = new AuctionController(auctionService);

router.get('/my-auctions', authMiddleware.protect, auctionController.getMyAuctions);
router.get('/my-bids', authMiddleware.protect, auctionController.getMyBids);

router.get('/:id', auctionController.getAuctionById);

router.post(
  '/', 
  authMiddleware.protect, 
  validateMiddleware.validate(CreateAuctionSchema), 
  auctionController.createAuction
);

router.post(
  '/:id/bid', 
  authMiddleware.protect, 
  validateMiddleware.validate(PlaceBidSchema), 
  auctionController.placeBid
);


export default router;