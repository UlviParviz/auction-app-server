import { Router } from 'express';
import { AuctionController } from '../controllers/AuctionController';
import { AuctionService } from '../services/AuctionService';
import { authMiddleware } from '../middlewares/AuthMiddleware';
import { validateMiddleware } from '../middlewares/ValidateMiddleware';
import { AuctionDTO } from '../dtos/AuctionDTO';

const router = Router();
const auctionService = new AuctionService();
const auctionController = new AuctionController(auctionService);

router.get('/my-auctions', authMiddleware.protect, auctionController.getMyAuctions);
router.get('/my-bids', authMiddleware.protect, auctionController.getMyBids);

router.get('/', auctionController.getAllAuctions);
router.get('/:id', auctionController.getAuctionById);

router.post(
  '/',
  authMiddleware.protect,
  validateMiddleware.validate(AuctionDTO.CreateAuctionSchema),
  auctionController.createAuction
);

router.post(
  '/:id/bid',
  authMiddleware.protect,
  validateMiddleware.validate(AuctionDTO.PlaceBidSchema),
  auctionController.placeBid
);

router.delete('/:id', authMiddleware.protect, auctionController.deleteMyAuction);


export default router;